class DisasterPhase extends PlayPhase {
    constructor() {
        super();
        this.name = 'disaster';
    }

    update() {
        super.update();

        push();
        fill(255);
        textSize(32);
        textAlign(CENTER);
        text('Disaster phase', width / 2, height * 0.3);
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
            let loser = players.reduce((min, player) => min?.score < player.score ? min : player, null);

            if (loser.pass)
                fromDisasterToPlay();

            sendUpdateToServer();
            return;
        }
        
        if (me.selectedCard.selected) {
            if (me.selectedCard.name == 'Disaster Insurance') {
                me.selectedCard.selected = me.selectedCard.focused = false;
                discardPile.add(me.selectedCard);
                me.hand.remove(me.selectedCard);
            } else if (me.selectedCard.name == 'Disaster Redirect') {
                // me.selectedCard.selected = me.selectedCard.focused = false;
                // discardPile.add(me.selectedCard);
                // me.hand.remove(me.selectedCard);
            }
        }
    }
}