class Hand {
    constructor(cards, owner_name, pos, angle) {
        this.cards = cards;
        this.face_up = owner_name == my_name;
        this.pos = pos;
        this.angle = angle;
        this.cards_slots = [];
        this.owner_name = owner_name;
    }

    toJSON() {
        return {
            cards: this.cards.map(card => card.toJSON()),
        }
    }

    fill(deck, n) {
        while (this.cards.length < n)
            this.draw_card_from(deck);
    }

    reorganize() {
        this.cards_slots = Array.from({ length: this.cards.length }, () => null).map((_, i) => {
            return {
                pos: this.pos.copy().add(createVector((1 - cos((i - this.cards.length / 2 + .5) / 3)) * (this.face_up ? 100 : 50), -(i - this.cards.length / 2 + .5) * (this.face_up ? 100 : 30)).rotate(this.angle)),
                angle: (i - this.cards.length / 2 + .5) * TWO_PI / (this.face_up ? 60 : 30) + (this.angle - HALF_PI),
                width: this.face_up ? 200 : 100,
                height: this.face_up ? 280 : 140,
            };
        });

        for (let i = 0; i < this.cards.length; i++) {
            this.cards[i].pos = this.cards_slots[i].pos.copy();
            this.cards[i].original_pos = this.cards_slots[i].pos.copy();
            this.cards[i].target_pos = this.cards_slots[i].pos.copy();

            this.cards[i].angle = this.cards_slots[i].angle;
            this.cards[i].original_angle = this.cards_slots[i].angle;
            this.cards[i].target_angle = this.cards_slots[i].angle;

            this.cards[i].width = this.cards_slots[i].width;
            this.cards[i].original_width = this.cards_slots[i].width;
            this.cards[i].target_width = this.cards_slots[i].width;

            this.cards[i].height = this.cards_slots[i].height;
        }
    }

    draw_card_from(deck) {
        if (deck.cards.length == 0)
            return;
        
        let card = deck.cards.pop();
        card.owner_name = this.owner_name;
        this.add(card);
    }

    add(card) {
        this.cards.push(card);
        this.reorganize();
    }

    remove(card) {
        this.cards = this.cards.filter(c => c != card);
        this.reorganize();
    }

    empty() {
        this.cards = [];
        this.reorganize();
    }

    update() {
        for (let i = 0; i < this.cards.length; i++) {
            this.cards[i].original_pos = this.cards_slots[i].pos.copy();
            this.cards[i].original_angle = this.cards_slots[i].angle;
            this.cards[i].original_width = this.cards_slots[i].width;
            this.cards[i].face_up = this.face_up;
            this.cards[i].update();
        }
    }

    reveal() {
        cursor('default');
        rectMode(CENTER, CENTER);
        for (let card of this.cards)
            card.show();
    }
}