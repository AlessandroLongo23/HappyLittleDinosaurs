class HLD_Deck extends Deck {
    constructor(cards, owner_name, face_up, pos, size, angle = 0, shuffle = true) {
        super(cards, owner_name, face_up, pos, size, angle, shuffle);
        this.revealed = false;
    }

    toJSON() {
        return { 
            cards: this.cards.map(card => card.toJSON()),
        };
    }

    fromJSON(data) {
        this.cards = []
        for (let card_data of data.cards) {
            let card = new ImageCard(100);
            card.fromJSON(card_data);
            this.add(card);
        }
    }
}