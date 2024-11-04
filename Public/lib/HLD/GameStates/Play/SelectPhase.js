class SelectPhase extends PlayPhase {
    constructor() {
        super();
        this.name = 'select';
        players.forEach(player => player.submitted = false);
    }

    draw() {
        super.draw();

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

    update() {
        if (me.submitted)
            return;

        me.findHoveredCard();
        me.hand.cards.filter(card => cardsInfo[card.frontImageIndex].type === 'score').forEach(card => {
            card.checkInteraction();
        });
    }

    handleClick() {
        if (me.submitted)
            return;

        me.hoveredCard = me?.hand.cards.find(card => card.selected);
        if (!me.hoveredCard || !me.hoveredCard.isOverlapping(createVector(mouseX, mouseY), me.hoveredCard.pos, me.hoveredCard.width, me.hoveredCard.height))
            return;

        me.hoveredCard.selected = me.hoveredCard.focused = false;
        me.submittedDeck.add(me.hoveredCard);
        me.hand.remove(me.hoveredCard);
        me.submitted = true;
        me.points = cardsInfo[me.hoveredCard.frontImageIndex].points;

        if (players.every(p => p.submitted || !p.isAlive)) {
            players.forEach(player => player.submittedDeck.faceUp = true);
            gameState = new EffectPhase();
        }
        
        sendUpdateToServer();
    }
}