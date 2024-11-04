class PlayPhase extends GameState {
    constructor() {
        super();
        this.name = 'play';
    }

    draw() {
        this.animate();
        
        for (let x = 0; x <= width + texture.width / 2; x += texture.width / 2)
            for (let y = 0; y <= height + texture.height / 2; y += texture.height / 2)
                image(texture, x, y, texture.width / 2, texture.height / 2);

        disasterDeck.show();
        mainDeck.show();
        disasterCard.show();
        hazardDeck.show();
        discardPile.show();

        players.filter(player => player.isAlive).forEach(player => player.show());
    }

    animate() {
        disasterDeck.animate();
        mainDeck.animate();
        disasterCard.animate();
        hazardDeck.animate();
        discardPile.animate();

        players.filter(player => player.isAlive).forEach(player => player.animate());
    }
}