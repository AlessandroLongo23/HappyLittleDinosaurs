class HLDPlayer extends Player {
    constructor(index, playersInfo) {
        super(index, playersInfo);
        
        this.submittedDeck = new HLDDeck(
            [],
            myName === this.name,
            this.pos.copy().sub(p5.Vector.fromAngle(this.angle).mult(width * .10)),
            createVector(width * .10, width * .14), this.angle - HALF_PI,
            this.name
        ); 
        this.hand = new HLDHand([], this.name, this.pos, this.angle);
        this.disasterHand = new HLDHand([], this.name, this.pos.copy().add(p5.Vector.fromAngle(this.angle - HALF_PI).mult(width * .33)), this.angle);
        this.hazardHand = new HLDHand([], this.name, this.pos.copy().add(p5.Vector.fromAngle(this.angle - HALF_PI).mult(width * -.33)), this.angle);
        this.isAlive = true;
        this.points = 0;
        this.score = 0;
        this.submitted = false;
        this.pass = false;
        this.alive = true;
        this.dinosaur = playersInfo[index].dinosaur;
    }

    toJSON() {
        return { 
            ...super.toJSON(),
            hand: this.hand.toJSON(),
            submitted: this.submitted,
            submittedDeck: this.submittedDeck.toJSON(),
            disasterHand: this.disasterHand.toJSON(),
            hazardHand: this.hazardHand.toJSON(),
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
        this.submittedDeck.fromJSON(data.submittedDeck);
        this.disasterHand.fromJSON(data.disasterHand);
        this.hazardHand.fromJSON(data.hazardHand);
        this.points = data.point;
        this.score = data.score;
        this.submitted = data.submitted;
        this.pass = data.pass;
        this.alive = data.alive;
        this.dinosaur = data.dinosaur;
    }

    animate() {
        super.animate();

        this.hand.animate();
        this.disasterHand.animate();
        this.submittedDeck.animate();
        this.hazardHand.animate();
    }

    findHoveredCard() {
        for (let card of this.hand.cards) {
            card.overlap = false;
            if (card.isOverlapping(createVector(mouseX, mouseY), card.originalPosition, card.width, card.height))
                card.overlap = createVector(mouseX, mouseY).dist(card.originalPosition)
        }

        let overlappingCards = this.hand.cards.filter(card => card.overlap);
        if (overlappingCards.length) {
            this.hand.cards.forEach(card => card.hovered = false);
            overlappingCards.reduce((min, card) => min?.hovered < card.hovered ? min : card, overlappingCards[0]).hovered = true;
        }
    }

    show() {
        this.submittedDeck.show();
        this.disasterHand.show();
        this.hazardHand.show();
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
        let categories = cardsInfo[disasterCard.cards[0].frontImageIndex].categories;
        let traitsModifier = (
            this.dinosaur.traits.meteor * categories.includes('Natural') * categories.includes('Predators') * categories.includes('Emotional') +
            this.dinosaur.traits.natural * categories.includes('Natural') + 
            this.dinosaur.traits.predators * categories.includes('Predators') + 
            this.dinosaur.traits.emotional * categories.includes('Emotional')
        )
        if (myName === this.name && gameState instanceof EffectPhase && cardsInfo[this.submittedDeck.cards[0].frontImageIndex].name === 'Pet Rock' && this.hand.cards.some(card => card.focused)) {
            fill(0, 200, 0, cos(frameCount / 10) * 50 + 205);
            text(this.points + traitsModifier + cardsInfo[this.hand.cards.find(card => card.focused).frontImageIndex].points, 50 + this.name.length * 10, -5);
        } else {
            if (traitsModifier > 0)
                fill(0, 200, 0);
            else if (traitsModifier < 0)
                fill(200, 0, 0);
            else
                fill(255);
            text(this.points + traitsModifier, 50 + this.name.length * 10, -5);
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
        
        gameState = 'game_over';
        sendUpdateToServer();
    }
}