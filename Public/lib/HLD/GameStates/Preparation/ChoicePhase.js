class ChoicePhase extends GameState {
    constructor() {
        super();
        this.name = 'choice';

        this.positions = [
            createVector(width * .16, height * .33),
            createVector(width * .16, height * .75),
            createVector(width * .83, height * .33),
            createVector(width * .83, height * .75),
        ]

        this.heroCards = dinosaursInfo.map((dinosaur, i) => new HeroCard(
            dinosaursImages[i],
            dinosaur,
            this.positions[i],
            height * .34, true
        ));
    }

    draw() {
        for (let x = 0; x <= width + texture.width / 2; x += texture.width / 2)
            for (let y = 0; y <= height + texture.height / 2; y += texture.height / 2)
                image(texture, x, y, texture.width / 2, texture.height / 2);

        cursor('default');

        this.heroCards.forEach(heroCard => heroCard.show());
        this.selectedHeroCard?.show();
    }

    update() {
        this.heroCards.forEach(heroCard => heroCard.checkHovering());
        let hoveredHeroCard = heroCards.find(heroCard => heroCard.hovered);
    
        // if any of the hero cards are hovered, a bigger version is shown in the middle
        if (hoveredHeroCard) {
            this.selectedHeroCard = new HeroCard(
                hoveredHeroCard.image,
                hoveredHeroCard.dinosaur,
                createVector(width * .50, height * .54),
                height * .51
            )
    
            this.selectedHeroCard.update();
        }
    
        push();
        textAlign(CENTER);
        textSize(64);
        text('CHOOSE A DINOSAUR', width * .50, height * .10);
        pop();
    }

    handleClick() {
        for (let heroCard of this.heroCards)
            if (heroCard.isOverlapping(createVector(mouseX, mouseY)))
                socket.send(JSON.stringify({ type: 'chosen', dinosaur: heroCard.dinosaur }));
    }

    startGame(playersInfo) {
        players = Array.from({ length: playersInfo.length }, () => null);
        for (let i = 0; i < playersInfo.length; i++) {
            players[i] = new HLDPlayer(i, playersInfo);
            players[i].hand.fill(mainDeck, cardsPerPlayer);
        }
        me = players.find(player => player.name === myName);
    
        disasterCard.add(disasterDeck.draw());
    
        gameState = new SelectPhase();
        frameCount = 0;
    
        if (me === players[0])
            sendUpdateToServer();
    }
}