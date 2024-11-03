const protocol = window.location.protocol == 'https:' ? 'wss:' : 'ws:';
const socket = new WebSocket(`${protocol}//${window.location.host}`);

socket.addEventListener('open', () => {
    console.log('WebSocket connection established');
});

socket.addEventListener('error', (error) => {
    console.error('WebSocket error:', error);
});

socket.addEventListener('message', event => {
    const data = JSON.parse(event.data);

    switch (data.type) {
        case 'setup':
            readyArr = data.readyArray;
            break;
        
        case 'ready':
            readyArr = data.readyArray;
            if (readyArr.every(client => client)) {
                document.getElementById('playerName').remove();
                gameState = new ChoicePhase();
            }
            break;

        case 'chosen':
            if (data.chosenArray.every(c => c))
                gameState.startGame(data.playersInfo);
            break;

        case 'update':
            switch (data.phase) {
                case 'connection':
                    gameState = new ConnectionPhase();
                    break;
                case 'choice':
                    gameState = new ChoicePhase();
                    break;
                case 'setup':
                    gameState = new SetupPhase();
                    break;
                case 'select':
                    gameState = new SelectPhase();
                    break;
                case 'effect':
                    gameState = new EffectPhase();
                    break;
                case 'scoring':
                    gameState = new ScoringPhase();
                    break;
                case 'disaster':
                    gameState = new DisasterPhase();
                    break;
            }
    
            mainDeck.fromJSON(data.mainDeck);
            disasterDeck.fromJSON(data.disasterDeck);
            disasterCard.fromJSON(data.disasterCard);
            discardPile.fromJSON(data.discardPile);
            effectsToPlay = data.effectsToPlay.map(c => {
                let card = new ImageCard(100);
                card.fromJSON(c);
                return card;
            });
    
            for (let i = 0; i < players.length; i++)
                players[i].fromJSON(data.players[i]);

            break;
    }
});

const sendUpdateToServer = () => {
    socket.send(JSON.stringify({ 
        type: 'update',
        phase: gameState.name,
        mainDeck: mainDeck.toJSON(),
        disasterDeck: disasterDeck.toJSON(),
        disasterCard: disasterCard.toJSON(),
        discardPile: discardPile.toJSON(),
        effectsToPlay: effectsToPlay.map(c => c.toJSON()),
        players: players.map(p => p.toJSON()),
    }));
}