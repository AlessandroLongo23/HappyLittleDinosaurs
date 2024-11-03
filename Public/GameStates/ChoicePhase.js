class ChoicePhase extends GameState {
    constructor() {
        super();
        this.name = 'choice';
    }

    update() {
        for (let x = 0; x <= width + texture.width / 2; x += texture.width / 2)
            for (let y = 0; y <= height + texture.height / 2; y += texture.height / 2)
                image(texture, x, y, texture.width / 2, texture.height / 2);
    
        let positions = [
            createVector(width * .16, height * .33),
            createVector(width * .16, height * .75),
            createVector(width * .83, height * .33),
            createVector(width * .83, height * .75),
        ]
        heroCards = dinosaursInfo.map((dinosaur, i) => new HeroCard(
            dinosaursImages[i],
            dinosaur,
            positions[i],
            height * .34, true
        ));
    
        cursor('default');
        for (let heroCard of heroCards) {
            heroCard.update();
            heroCard.show();
        }
    
        if (heroCards.some(heroCard => heroCard.hovered)) {
            let selectedHeroCard = new HeroCard(
                heroCards.find(heroCard => heroCard.hovered).image,
                heroCards.find(heroCard => heroCard.hovered).dinosaur,
                createVector(width * .50, height * .54),
                height * .51
            )
    
            selectedHeroCard.update();
            selectedHeroCard.show();
        }
    
        push();
        textAlign(CENTER);
        textSize(64);
        text('CHOOSE A DINOSAUR', width * .50, height * .10);
        pop();
    }

    handleClick() {
        for (let heroCard of heroCards)
            if (heroCard.overlap(createVector(mouseX, mouseY)))
                socket.send(JSON.stringify({ type: 'chosen', dinosaur: heroCard.dinosaur }));
    }

    startGame(playersInfo) {
        players = Array.from({ length: playersInfo.length }, () => null);
        for (let i = 0; i < playersInfo.length; i++) {
            players[i] = new HLDPlayer(i, playersInfo);
            players[i].hand.fill(mainDeck, cardsPerPlayer);
        }
        me = players.find(player => player.name == myName);
    
        disasterCard.add(disasterDeck.draw());
    
        gameState = new SelectPhase();
        frameCount = 0;
    
        if (me == players[0])
            sendUpdateToServer();
    }
}