class HLDDeck extends Deck {
    constructor(cards, faceUp, pos, size, ownerName = null, angle = 0, shuffle = true) {
        super(cards, faceUp, pos, size, ownerName, angle, shuffle);
        this.revealed = false;
    }

    toJSON() {
        return { 
            cards: this.cards.map(card => card.toJSON()),
        };
    }

    fromJSON(data) {
        this.cards = []
        for (let cardData of data.cards) {
            let card = new ImageCard(100);
            card.fromJSON(cardData);
            this.add(card);
        }
    }
}