const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.static('public'));

let clients = [];
let players_info = [];

wss.on('connection', (ws) => {
    clients.push({ socket: ws, ready: false, chosen: false });

    console.log('New client connected. Total clients:', clients.length);
    
    broadcastSetup();

    ws.on('message', (message) => {
        const data = JSON.parse(message);
        if (data.type == 'ready') {
            for (let i = 0; i < clients.length; i++)
                if (clients[i].socket == ws)
                    clients[i].ready = true;

            broadcastReady();
        } else if (data.type == 'chosen') {
            for (let i = 0; i < clients.length; i++) {
                if (clients[i].socket == ws) {
                    clients[i].chosen = true;
                    if (!players_info[i]) players_info[i] = {};
                    players_info[i].dinosaur = data.dinosaur;
                }
            }

            broadcastChosen();
        } else if (data.type == 'name') {
            for (let i = 0; i < clients.length; i++) {
                if (clients[i].socket == ws) {
                    if (!players_info[i]) players_info[i] = {};
                    players_info[i].name = data.name
                }
            }
        } else if (data.type == 'update') {
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
    broadcast({ type: 'setup', ready_arr: clients.map(c => c.ready) });
}

function broadcastChosen() {
    broadcast({ type: 'chosen', chosen_arr: clients.map(c => c.chosen), players_info: players_info });
}

function broadcastReady() {
    broadcast({ type: 'ready', ready_arr: clients.map(c => c.ready), players_info: players_info }); 
}

function broadcastUpdate(data) {
    broadcast({ 
        type: 'update', 
        phase: data.phase, 
        main_deck: data.main_deck,
        disaster_deck: data.disaster_deck,
        disaster_card: data.disaster_card,
        discard_pile: data.discard_pile,
        effect_to_play: data.effect_to_play,
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

