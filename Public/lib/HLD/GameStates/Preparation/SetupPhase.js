class SetupPhase extends GameState {
    constructor() {
        super();
        this.name = 'setup';
    }

    draw() {
        
    }

    update() {
        if (myName === players[0].name) {
            gameState = new SelectPhase();
            sendUpdateToServer();
        }
    }
}