class ScoringPhase extends PlayPhase {
    constructor() {
        super();
        this.name = 'scoring';
    }

    update() {
        super.update();

        push();
        fill(255);
        textSize(32);
        textAlign(CENTER);
        text('Scoring phase', width / 2, height * 0.3);
        pop();

        if (!me.pass) {
            passButton.update();
            passButton.show();
        }
    }

    handleClick() {
        me.selectedCard = me?.hand.cards.find(card => card.selected);
        if (!me.selectedCard || !me.selectedCard.overlap(createVector(mouseX, mouseY), me.selectedCard.pos, me.selectedCard.width, me.selectedCard.height)) {
            if (!passButton.overlap(createVector(mouseX, mouseY)))
                return;

            me.pass = true;

            if (players.every(p => p.pass)) {
                for (let player of players)
                    player.pass = false;

                gameState = new DisasterPhase();

                let loser = players.reduce((min, player) => min?.score < player.score ? min : player, null);
                if (!loser.hand.cards.some(c => cardsInfo[c.frontImageIndex].type == 'instant'))
                    fromDisasterToPlay();
            }

            sendUpdateToServer();
            return;
        }

        if (me.selectedCard.selected) {
            me.selectedCard.selected.points += cardsInfo[me.selectedCard.frontImageIndex].modifier;
            me.selectedCard.selected = me.selectedCard.focused = false;
            discardPile.add(me.selectedCard);
            me.hand.remove(me.selectedCard);
        }
    }
}