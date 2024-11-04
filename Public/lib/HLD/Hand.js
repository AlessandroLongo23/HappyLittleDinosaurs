class HLDHand extends Hand {
    constructor(cards, ownerName, pos, angle) {
        super(cards, ownerName, pos, angle);
        this.revealed = false;
    }

    fromJSON(data) {
        this.cards = []
        for (let cardData of data.cards) {
            let card = new ImageCard(100);
            card.fromJSON(cardData);
            this.add(card);
        }
    }

    show() {
        cursor('default');
        rectMode(CENTER, CENTER);
        let owner = players.find(p => p.name === this.ownerName);
        for (let card of this.cards) {
            let disabled = owner.name === myName && (
                (gameState instanceof SelectPhase && cardsInfo[card.frontImageIndex].type !== 'score') ||
                (gameState instanceof EffectPhase && cardsInfo[card.frontImageIndex].type !== 'score') ||
                (gameState instanceof ScoringPhase && cardsInfo[card.frontImageIndex].type !== 'modifier') ||
                (gameState instanceof DisasterPhase && cardsInfo[card.frontImageIndex].type !== 'instant')
            );
            card.show(disabled);
        }
    }

    animate() {
        super.animate();
        
        if (this.revealed) {
            for (let card of this.cards) {
                card.originalPosition = card.pos.copy();
                card.originalAngle = card.angle;
                card.originalWidth = card.width;
                card.faceUp = this.faceUp;
                card.animate();
            }
        }
    }

    fill(deck, n) {
        super.fill(deck, n);

        while (!this.cards.map(c => cardsInfo[c.frontImageIndex].type).some(type => type === 'score')) {
            while (this.cards.length)
                discardPile.add(this.draw());

            super.fill(deck, n);
        }
    }
}