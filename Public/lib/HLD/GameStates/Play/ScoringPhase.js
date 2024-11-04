class ScoringPhase extends PlayPhase {
    constructor() {
        super();
        this.name = 'scoring';

        players.forEach(player => player.pass = false);
    }

    draw() {
        super.draw();

        push();
        fill(255);
        textSize(32);
        textAlign(CENTER);
        text('Scoring phase', width / 2, height * 0.3);
        pop();

        if (!me.pass)
            passButton.show();
    }

    update() {
        if (!me.pass)
            passButton.update();

        me.findHoveredCard();
        me.hand.cards.filter(card => cardsInfo[card.frontImageIndex].type === 'modifier').forEach(card => {
            card.checkInteraction();
        });
    }

    handleClick() {
        me.hoveredCard = me?.hand.cards.find(card => card.selected);
        if (!me.hoveredCard || !me.hoveredCard.isOverlapping(createVector(mouseX, mouseY), me.hoveredCard.pos, me.hoveredCard.width, me.hoveredCard.height)) {
            if (!passButton.isOverlapping(createVector(mouseX, mouseY)))
                return;

            me.pass = true;
            if (players.every(p => p.pass || !p.isAlive))
                gameState = new DisasterPhase();

            sendUpdateToServer();
            return;
        }

        if (me.hoveredCard.selected) {
            me.hoveredCard.selected.points += cardsInfo[me.hoveredCard.frontImageIndex].modifier;
            me.hoveredCard.selected = me.hoveredCard.focused = false;
            discardPile.add(me.hoveredCard);
            me.hand.remove(me.hoveredCard);
        }
    }
}