class DisasterPhase extends PlayPhase {
    constructor() {
        super();
        this.name = 'disaster';

        players.forEach(player => player.pass = false);
    }

    draw() {
        super.draw();

        push();
        fill(255);
        textSize(32);
        textAlign(CENTER);
        text('Disaster phase', width / 2, height * 0.3);
        pop();

        if (!me.pass)
            passButton.show();
    }

    update() {
        if (!me.pass)
            passButton.update();

        me.findHoveredCard();
    }

    handleClick() {
        me.hoveredCard = me?.hand.cards.find(card => card.selected);

        if (passButton.isOverlapping(createVector(mouseX, mouseY))) {
            me.pass = true;
            let loser = players.reduce((min, player) => min?.score < player.score ? min : player, null);

            if (loser.pass)
                this.fromDisasterToPlay();

            sendUpdateToServer();
            return;
        }
        
        if (me.hoveredCard.selected) {
            if (me.hoveredCard.name === 'Disaster Insurance') {
                me.hoveredCard.selected = me.hoveredCard.focused = false;
                discardPile.add(me.hoveredCard);
                me.hand.remove(me.hoveredCard);
            } else if (me.hoveredCard.name === 'Disaster Redirect') {
                // me.hoveredCard.selected = me.hoveredCard.focused = false;
                // discardPile.add(me.hoveredCard);
                // me.hand.remove(me.hoveredCard);
            }
        }
    }

    fromDisasterToPlay() {
        for (let player of players)
            player.pass = false;
    
        let lowestScorePlayer = players.reduce((min, player) => min?.score < player.score ? min : player, null);
        let highestScorePlayer = players.reduce((max, player) => max?.score > player.score ? max : player, null);
    
        lowestScorePlayer.disasterHand.add(disasterCard.draw());
        const disasters = lowestScorePlayer.disasterHand.cards.map(c => cardsInfo[c.frontImageIndex].categories).flat();
        if (losingCombinations(disasters))
            lowestScorePlayer.isAlive = false;
    
        disasterCard.add(disasterDeck.draw());
    
        highestScorePlayer.points += highestScorePlayer.score;
        for (let player of players) {
            player.score = 0;
            player.points += player.disasterHand.cards.length;
            if (player.points > 50)
                player.win();
    
            discardPile.add(player.submittedDeck.draw());
            player.hand.fill(mainDeck, cardsPerPlayer);
        }
    
        gameState = new SelectPhase();
    }
}

function losingCombinations(arr) {
    const counts = arr.reduce((acc, val) => {
        acc[val] = (acc[val] || 0) + 1;
        return acc;
    }, {});

    // TODO add three different types

    return Object.values(counts).some(count => count >= 3);
}