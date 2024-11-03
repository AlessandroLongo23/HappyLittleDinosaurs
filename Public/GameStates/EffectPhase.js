class EffectPhase extends PlayPhase {
    constructor() {
        super();
        this.name = 'effect';
    }

    update() {
        super.update();

        me.selectedCard = me?.hand.cards.find(card => card.selected);
        if (!me.selectedCard || !me.selectedCard.overlap(createVector(mouseX, mouseY), me.selectedCard.pos, me.selectedCard.width, me.selectedCard.height))
            return;
        
        let effectCard = effectsToPlay[0];
        if (effectCard.ownerName == me.name) {
            if (effectCard.name == "Pet Rock" || effectCard.name == "Delicious Smoothie") {
                me.selectedCard.selected = me.selectedCard.focused = false;
                discardPile.add(me.selectedCard);
                me.hand.remove(me.selectedCard);
                effectsToPlay.shift();
                me.points += cardsInfo[me.selectedCard.frontImageIndex].points; 

                if (effectsToPlay.length == 0)
                    gameState = new ScoringPhase();
            }
        }

        push();
        fill(255);
        textSize(32);
        textAlign(CENTER);
        text('Effect phase', width / 2, height * 0.3);
        pop();
    }

    handleClick() {
        me.selectedCard = me?.hand.cards.find(card => card.selected);
        if (!me.selectedCard || !me.selectedCard.overlap(createVector(mouseX, mouseY), me.selectedCard.pos, me.selectedCard.width, me.selectedCard.height))
            return;

        let effectCard = effectsToPlay[0];
        if (effectCard.ownerName == me.name)
            effectCard.applyEffect();

        sendUpdateToServer();
    }
}