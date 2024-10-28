class Deck {
    constructor(cards, face_up, pos, size, angle = 0, shuffle = true, owner_name = null) {
        this.cards = cards;
        this.face_up = owner_name ? owner_name == my_name : face_up;
        this.pos = pos;
        this.size = size;
        this.angle = angle;
        this.owner_name = owner_name

        for (let card of this.cards) {
            card.face_up = this.face_up;
            card.pos = this.pos.copy();
            card.width = this.size.x;
            card.height = this.size.y;
            card.angle = this.angle;
        }

        if (shuffle) this.shuffle();
    }

    update() {
        for (let card of this.cards) {
            card.face_up = this.face_up;
            card.target_pos = this.pos.copy();
            card.target_angle = this.angle;
            card.target_width = this.size.x;
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
        card.target_pos = this.pos.copy();
        card.target_angle = this.angle;
        card.target_width = this.size.x;
        card.height = this.size.y;
        this.cards.push(card);
    }
}