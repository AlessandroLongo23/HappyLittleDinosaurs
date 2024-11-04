class Hand {
    constructor(cards, ownerName, pos, angle) {
        this.cards = cards;
        this.faceUp = ownerName === myName;
        this.pos = pos;
        this.angle = angle;
        this.cardsSlots = [];
        this.ownerName = ownerName;
    }

    toJSON() {
        return {
            cards: this.cards.map(card => card.toJSON()),
        }
    }

    fill(deck, n) {
        while (this.cards.length < n)
            this.drawCardFrom(deck);
    }

    reorganize() {
        this.cardsSlots = Array.from({ length: this.cards.length }, () => null).map((_, i) => {
            return {
                pos: this.pos.copy().add(createVector((1 - cos((i - this.cards.length / 2 + .5) / 3)) * (this.faceUp ? 100 : 50), -(i - this.cards.length / 2 + .5) * (this.faceUp ? 100 : 30)).rotate(this.angle)),
                angle: (i - this.cards.length / 2 + .5) * TWO_PI / (this.faceUp ? 60 : 30) + (this.angle - HALF_PI),
                width: this.faceUp ? 200 : 100,
                height: this.faceUp ? 280 : 140,
            };
        });

        for (let i = 0; i < this.cards.length; i++) {
            this.cards[i].pos = this.cardsSlots[i].pos.copy();
            this.cards[i].originalPosition = this.cardsSlots[i].pos.copy();
            this.cards[i].targetPosition = this.cardsSlots[i].pos.copy();

            this.cards[i].angle = this.cardsSlots[i].angle;
            this.cards[i].originalAngle = this.cardsSlots[i].angle;
            this.cards[i].targetAngle = this.cardsSlots[i].angle;

            this.cards[i].width = this.cardsSlots[i].width;
            this.cards[i].originalWidth = this.cardsSlots[i].width;
            this.cards[i].targetWidth = this.cardsSlots[i].width;

            this.cards[i].height = this.cardsSlots[i].height;
        }
    }

    drawCardFrom(deck) {
        if (deck.cards.length === 0)
            return;
        
        let card = deck.cards.pop();
        card.ownerName = this.ownerName;
        this.add(card);
    }

    add(card) {
        this.cards.push(card);
        this.reorganize();
    }

    remove(card) {
        this.cards = this.cards.filter(c => c !== card);
        this.reorganize();
    }

    empty() {
        this.cards = [];
        this.reorganize();
    }

    animate() {
        for (let i = 0; i < this.cards.length; i++) {
            this.cards[i].originalPosition = this.cardsSlots[i].pos.copy();
            this.cards[i].originalAngle = this.cardsSlots[i].angle;
            this.cards[i].originalWidth = this.cardsSlots[i].width;
            this.cards[i].faceUp = this.faceUp;
            this.cards[i].animate();
        }
    }

    reveal() {
        cursor('default');
        rectMode(CENTER, CENTER);
        for (let card of this.cards)
            card.show();
    }
}