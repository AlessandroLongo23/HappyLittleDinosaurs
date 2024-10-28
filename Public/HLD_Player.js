class HLD_Player extends Player {
    constructor(index, players_info) {
        super(index, players_info);
        
        this.submitted_deck = new Deck([], my_name, my_name == this.name, this.pos.copy().sub(p5.Vector.fromAngle(this.angle).mult(width * .10)), createVector(width * .10, width * .14), this.angle - HALF_PI);
        this.hand = new HLD_Hand([], this.name, this.pos, this.angle);
        this.disaster_hand = new HLD_Hand([], this.name, this.pos.copy().add(p5.Vector.fromAngle(this.angle - HALF_PI).mult(width * .33)), this.angle);
        this.hazard_hand = new HLD_Hand([], this.name, this.pos.copy().add(p5.Vector.fromAngle(this.angle - HALF_PI).mult(width * -.33)), this.angle);
        this.points = 0;
        this.score = 0;
        this.submitted = false;
        this.pass = false;
        this.alive = true;
        this.dinosaur = players_info[index].dinosaur;
    }

    toJSON() {
        return { 
            ...super.toJSON(),
            hand: this.hand.toJSON(),
            submitted: this.submitted,
            submitted_deck: this.submitted_deck.toJSON(),
            disaster_hand: this.disaster_hand.toJSON(),
            hazard_hand: this.hazard_hand.toJSON(),
            point: this.points,
            score: this.score,
            pass: this.pass,
            alive: this.alive,
            dinosaur: this.dinosaur,
        };
    }

    fromJSON(data) {
        super.fromJSON(data);
        this.hand.fromJSON(data.hand);
        this.submitted_deck.fromJSON(data.submitted_deck);
        this.disaster_hand.fromJSON(data.disaster_hand);
        this.hazard_hand.fromJSON(data.hazard_hand);
        this.points = data.point;
        this.score = data.score;
        this.submitted = data.submitted;
        this.pass = data.pass;
        this.alive = data.alive;
        this.dinosaur = data.dinosaur;
    }

    update() {
        super.update();
        this.hand.update();

        if (my_name == this.name) {
            for (let card of this.hand.cards)
                card.hovered = false;

            if (game_phase == 'play') {
                for (let card of this.hand.cards)
                    if (!this.submitted && cards_info[card.front_image_index].type == 'score' && card.overlap(createVector(mouseX, mouseY), card.original_pos, card.width, card.height))
                        card.hovered = createVector(mouseX, mouseY).dist(card.original_pos)
            } else if (game_phase == 'effect') {
                let effect_card = effect_to_play[0];
                if (effect_card.owner_name == this.name) {
                    switch (effect_card.name) {
                        case 'Pet Rock':
                            for (let card of this.hand.cards)
                                if (cards_info[card.front_image_index].type == 'score' && card.overlap(createVector(mouseX, mouseY), card.original_pos, card.width, card.height))
                                    card.hovered = createVector(mouseX, mouseY).dist(card.original_pos)
                            break;
                        case 'Dino Grabber':
                            for (let player of players)
                                if (player.name != this.name && player.overlap(createVector(mouseX, mouseY), player.pos, 50)) 
                                    player.hand.reveal();
                            break;
                        case 'Delicious Smoothie':
                            for (let card of this.hand.cards)
                                if (cards_info[card.front_image_index].type == 'score' && cards_info[card.front_image_index].effect != null && card.overlap(createVector(mouseX, mouseY), card.original_pos, card.width, card.height))
                                    card.hovered = createVector(mouseX, mouseY).dist(card.original_pos)
                        case 'Fire Spray':
                            for (let card of this.hand.cards)
                                if (my_name == this.name && card.overlap(createVector(mouseX, mouseY), card.original_pos, card.width, card.height))
                                    card.hovered = createVector(mouseX, mouseY).dist(card.original_pos)
                            break;
                    }
                }
            } else if (game_phase == 'scoring') {
                for (let card of this.hand.cards)
                    if (cards_info[card.front_image_index].type == 'modifier' && card.overlap(createVector(mouseX, mouseY), card.original_pos, card.width, card.height))
                        card.hovered = createVector(mouseX, mouseY).dist(card.original_pos)
            } else if (game_phase == 'disaster') {
                for (let card of this.hand.cards)
                    if (cards_info[card.front_image_index].type == 'instant' && card.overlap(createVector(mouseX, mouseY), card.original_pos, card.width, card.height))
                        card.hovered = createVector(mouseX, mouseY).dist(card.original_pos)
            }

            let hovered_cards = this.hand.cards.filter(card => card.hovered);
            if (hovered_cards.length) {
                this.hand.cards.forEach(card => card.focused = false);
                hovered_cards.reduce((min, card) => min?.hovered < card.hovered ? min : card, hovered_cards[0]).focused = true;
            }

            for (let card of this.hand.cards) {
                card.check_interaction();
                card.update();
            }
        }

        this.disaster_hand.update();
        this.submitted_deck.update();
        this.hazard_hand.update();
    }

    show() {
        this.submitted_deck.show();
        this.disaster_hand.show();
        this.hazard_hand.show();
        this.hand.show();
        super.show();

        push();
        translate(p5.Vector.add(this.pos, p5.Vector.fromAngle(this.angle).mult(sqrt(sq(height * 0.05 * sin(this.angle)) + sq(width * 0.05 * cos(this.angle)))))); 
        rotate(this.angle - HALF_PI);

        rectMode(CENTER);
        stroke(255);
        fill(0);
        rect(50 + this.name.length * 10, 0, 50, 50, 10);

        textSize(40);
        textAlign(CENTER, CENTER);
        noStroke();
        let categories = cards_info[disaster_card.cards[0].front_image_index].categories;
        let traits_modifier = (
            this.dinosaur.traits.meteor * categories.includes('Natural') * categories.includes('Predators') * categories.includes('Emotional') +
            this.dinosaur.traits.natural * categories.includes('Natural') + 
            this.dinosaur.traits.predators * categories.includes('Predators') + 
            this.dinosaur.traits.emotional * categories.includes('Emotional')
        )
        if (my_name == this.name && game_phase == 'effect' && cards_info[this.submitted_deck.cards[0].front_image_index].name == 'Pet Rock' && this.hand.cards.some(card => card.focused)) {
            fill(0, 200, 0, cos(frameCount / 10) * 50 + 205);
            text(this.points + traits_modifier + cards_info[this.hand.cards.find(card => card.focused).front_image_index].points, 50 + this.name.length * 10, -5);
        } else {
            if (traits_modifier > 0)
                fill(0, 200, 0);
            else if (traits_modifier < 0)
                fill(200, 0, 0);
            else
                fill(255);
            text(this.points + traits_modifier, 50 + this.name.length * 10, -5);
        }
        pop();
    }

    win() {
        push();
        rectMode(CENTER);
        stroke(0);
        fill(255);
        rect(width * .5, height * .5, width * .4, height * .2);

        textAlign(CENTER);
        textSize(48);
        text(this.name + ' won!', width * .5, height * .5);
        pop();
        
        game_phase = 'game_over';
        send_update_to_server();
    }
}