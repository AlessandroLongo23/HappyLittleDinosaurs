class SelectPhase extends PlayPhase {
    constructor() {
        super();
        this.name = 'select';
    }

    update() {
        super.update();

        push();
        fill(255);
        textSize(32);
        textAlign(CENTER);
        let dots = '.'.repeat(frameCount / 30 % 4)
        let textString;
        if (!me.submitted)
            textString = 'Play a card';
        else
            textString = 'Waiting for the other players' + dots + " (" + players.filter(p => p.submitted).length + " / " + players.length + ")";
        text(textString, width / 2, height * 0.3);
        pop();
    }

    handleClick() {
        me.selectedCard = me?.hand.cards.find(card => card.selected);
        if (!me.selectedCard || !me.selectedCard.overlap(createVector(mouseX, mouseY), me.selectedCard.pos, me.selectedCard.width, me.selectedCard.height))
            return;

        if (!me.submitted) {
            me.selectedCard.selected = me.selectedCard.focused = false;
            me.submittedDeck.add(me.selectedCard);
            me.hand.remove(me.selectedCard);
            me.submitted = true;
            me.points = cardsInfo[me.selectedCard.frontImageIndex].points;

            if (players.every(p => p.submitted)) {
                for (let player of players) {
                    player.submittedDeck.faceUp = true;
                    player.submitted = false;
                }

                gameState = new EffectPhase();
                if (players.some(p => cardsInfo[p.submittedDeck.cards[0].frontImageIndex].name == 'Flaming Chainsaw')) 
                    effectsToPlay = [];
                else
                    effectsToPlay = players
                    .map(p => p.submittedDeck.cards[0])
                    .filter(c => cardsInfo[c.frontImageIndex].effect && !cardsInfo[c.frontImageIndex].effect.includes('During scoring this round'))
                    .sort((a, b) => cardsInfo[a.frontImageIndex].points - cardsInfo[b.frontImageIndex].points)
                    // .map(c => new Object({ name: cardsInfo[c.frontImageIndex].name, ownerName: c.ownerName }));
            
                if (effectsToPlay.length == 0)
                    gameState = new ScoringPhase();
            }
        }

        sendUpdateToServer();
    }
}