class SetupPhase extends GameState {
    constructor() {
        super();
        this.name = 'setup';
    }

    update() {
        if (myName == players[0].name) {
            gameState = new SelectPhase();
            sendUpdateToServer();
        }
    }
}