const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.static('public'));

let clients = [];
let playersInfo = [];

wss.on('connection', (ws) => {
    clients.push({ socket: ws, isReady: false, chosen: false });

    console.log('New client connected. Total clients:', clients.length);
    
    broadcastSetup();

    ws.on('message', (message) => {
        const data = JSON.parse(message);
        if (data.type === 'ready') {
            for (let i = 0; i < clients.length; i++)
                if (clients[i].socket === ws)
                    clients[i].isReady = true;

            broadcastReady();
        } else if (data.type === 'chosen') {
            for (let i = 0; i < clients.length; i++) {
                if (clients[i].socket === ws) {
                    clients[i].chosen = true;
                    if (!playersInfo[i]) 
                        playersInfo[i] = {};
                    playersInfo[i].dinosaur = data.dinosaur;
                }
            }

            broadcastChosen();
        } else if (data.type === 'name') {
            for (let i = 0; i < clients.length; i++) {
                if (clients[i].socket === ws) {
                    if (!playersInfo[i]) 
                        playersInfo[i] = {};
                    playersInfo[i].name = data.name
                }
            }
        } else if (data.type === 'update') {
            broadcastUpdate(data);
        }
    });

    ws.on('close', () => {
        clients = clients.filter(client => client.socket !== ws);
        console.log('Client disconnected. Remaining clients:', clients.length);
        broadcastSetup();
    });
});

function broadcastSetup() {
    broadcast({ type: 'setup', readyArray: clients.map(c => c.isReady) });
}

function broadcastChosen() {
    broadcast({ type: 'chosen', chosenArray: clients.map(c => c.chosen), playersInfo: playersInfo });
}

function broadcastReady() {
    broadcast({ type: 'ready', readyArray: clients.map(c => c.isReady), playersInfo: playersInfo }); 
}

function broadcastUpdate(data) {
    broadcast({ 
        type: 'update', 
        phase: data.phase, 
        mainDeck: data.mainDeck,
        disasterDeck: data.disasterDeck,
        disasterCard: data.disasterCard,
        discardPile: data.discardPile,
        effectCardsToPlay: data.effectCardsToPlay,
        players: data.players,
    });
}

function broadcast(message) {
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN)
            client.send(JSON.stringify(message));
    });
}

const PORT = 5503;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

