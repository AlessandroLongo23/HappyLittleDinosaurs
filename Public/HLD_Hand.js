class HLD_Hand extends Hand {
    constructor(cards, owner_name, pos, angle) {
        super(cards, owner_name, pos, angle);
        this.revealed = false;
    }

    fromJSON(data) {
        this.cards = []
        for (let card_data of data.cards) {
            let card = new ImageCard(100);
            card.fromJSON(card_data);
            this.add(card);
        }
    }

    show() {
        cursor('default');
        rectMode(CENTER, CENTER);
        let owner = players.find(p => p.name == this.owner_name);
        for (let card of this.cards) {
            let disabled = owner.name == my_name && (
                (game_phase == 'play' && cards_info[card.front_image_index].type != 'score') ||
                (game_phase == 'effect' && cards_info[card.front_image_index].type != 'score') ||
                (game_phase == 'scoring' && cards_info[card.front_image_index].type != 'modifier') ||
                (game_phase == 'disaster' && cards_info[card.front_image_index].type != 'instant')
            );
            card.show(disabled);
        }
    }

    update() {
        super.update();
        
        if (this.revealed) {
            for (let card of this.cards) {
                card.original_pos = card.pos.copy();
                card.original_angle = card.angle;
                card.original_width = card.width;
                card.face_up = this.face_up;
                card.update();
            }
        }
    }
}