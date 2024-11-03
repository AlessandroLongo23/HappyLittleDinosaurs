class Deck {
    constructor(cards, faceUp, pos, size, ownerName = null, angle = 0, shuffle = true) {
        this.cards = cards;
        this.faceUp = ownerName ? ownerName == myName : faceUp;
        this.pos = pos;
        this.size = size;
        this.angle = angle;
        this.ownerName = ownerName

        for (let card of this.cards) {
            card.faceUp = this.faceUp;
            card.pos = this.pos.copy();
            card.width = this.size.x;
            card.height = this.size.y;
            card.angle = this.angle;
        }

        if (shuffle) this.shuffle();
    }

    update() {
        for (let card of this.cards) {
            card.faceUp = this.faceUp;
            card.targetPosition = this.pos.copy();
            card.targetAngle = this.angle;
            card.targetWidth = this.size.x;
            card.update();
        }
    }

    show() {
        rectMode(CENTER, CENTER);
        if (this.cards.length >= 2)
            this.cards[this.cards.length - 2].show();

        if (this.cards.length >= 1)
            this.cards[this.cards.length - 1].show();

        if (this.cards.length > 1) {
            push();
            fill(255);
            stroke(0);
            rectMode(CENTER, CENTER);
            rect(this.pos.x + this.size.x / 2, this.pos.y + this.size.y / 2, 30, 20, 5);
            noStroke();
            fill(0);
            textSize(15);
            textAlign(CENTER);
            text(this.cards.length, this.pos.x + this.size.x / 2, this.pos.y + this.size.y / 2 + 5);
            pop();
        }
    }

    shuffle() {
        this.cards.sort(() => Math.random() - .5);
    }

    draw(card = null) {
        if (this.cards.length == 0) 
            return;

        if (!card)
            return this.cards.pop();

        this.cards.splice(this.cards.indexOf(card), 1);
        return card;
    }

    add(card) {
        card.targetPosition = this.pos.copy();
        card.targetAngle = this.angle;
        card.targetWidth = this.size.x;
        card.height = this.size.y;
        this.cards.push(card);
    }
}