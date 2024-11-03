class PlayPhase extends GameState {
    constructor() {
        super();
        this.name = 'play';
    }

    update() {
        // draw the background
        for (let x = 0; x <= width + texture.width / 2; x += texture.width / 2)
            for (let y = 0; y <= height + texture.height / 2; y += texture.height / 2)
                image(texture, x, y, texture.width / 2, texture.height / 2);
    
        // update and show the decks
        disasterDeck.update();
        disasterDeck.show();
    
        mainDeck.update();
        mainDeck.show();
    
        disasterCard.update();
        disasterCard.show();
    
        hazardDeck.update();
        hazardDeck.show();
    
        discardPile.update();
        discardPile.show();

        // update and show the players
        for (let player of players.filter(p => p != me)) {
            player.update();
            player.show();
        }
        
        me.update();
        me.checkHoveredCards();
        me.show();
    }
}