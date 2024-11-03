class ImageCard extends Card {
    constructor(width, frontImageIndex, backImageIndex) {
        super(width);
        this.frontImageIndex = frontImageIndex;
        this.backImageIndex = backImageIndex;
    }

    update() {
        if (this.targetAngle != null) 
            this.angle += (this.targetAngle - this.angle) * 0.1;

        if (this.targetWidth != null) {
            this.width += (this.targetWidth - this.width) * 0.1;
            this.height = this.width * 1.4;
        }
        
        if (this.targetPosition != null) 
            this.pos.add(p5.Vector.sub(this.targetPosition, this.pos).mult(0.1));
    }

    overlap(a, b, w, h) {
        return (
            a.x > b.x - w / 2 && 
            a.x < b.x + w / 2 && 
            a.y > b.y - h / 2 &&
            a.y < b.y + h / 2
        )
    }

    checkInteraction() {
        this.targetWidth = this.originalWidth;
        this.targetAngle = this.originalAngle;
        this.targetPosition = this.originalPosition;

        if (this.focused)
            this.targetPosition.set(p5.Vector.add(this.originalPosition, p5.Vector.fromAngle(this.angle - HALF_PI).mult(this.height * .5)));

        if (gameState instanceof SelectPhase || gameState instanceof EffectPhase) {
            this.selected = (
                this.focused && 
                this.pos.dist(this.targetPosition) < 5 &&
                this.overlap(createVector(mouseX, mouseY), this.pos, this.width, this.height)
            )
        } else if (gameState instanceof ScoringPhase) {
            this.selected = (
                this.pos.dist(this.targetPosition) < 5 &&
                this.overlap(createVector(mouseX, mouseY), this.pos, this.width, this.height)
            )

            let minDist = float('inf');
            this.selected = null;
            for (let player of players) {
                let d = player.pos.dist(createVector(mouseX, mouseY));
                if (d < height * .25 && d < minDist) {
                    this.selected = player;
                    minDist = d;
                }
            }
        }
    }

    show(disabled = false) {
        push();
        if (this.selected)
            cursor('pointer');
        
        stroke(this.selected ? color(0, 200, 0) : color(0));
        noFill();
        translate(this.pos);
        rotate(this.angle);

        let cornerRadius = this.height / 32;
        drawingContext.save();
        drawingContext.beginPath();
        drawingContext.moveTo(-this.width / 2, -this.height / 2);
        drawingContext.arcTo(this.width / 2, -this.height / 2, this.width / 2, this.height / 2, cornerRadius);
        drawingContext.arcTo(this.width / 2, this.height / 2, -this.width / 2, this.height / 2, cornerRadius);
        drawingContext.arcTo(-this.width / 2, this.height / 2, -this.width / 2, -this.height / 2, cornerRadius);
        drawingContext.arcTo(-this.width / 2, -this.height / 2, this.width / 2, -this.height / 2, cornerRadius);
        drawingContext.closePath();
        drawingContext.clip();
        image(this.faceUp ? frontImages[this.frontImageIndex] : backImages[this.backImageIndex], 0, 0, this.width, this.height);
        drawingContext.restore();

        fill(0, disabled ? 127 : 0);
        rect(0, 0, this.width, this.height, cornerRadius);

        pop();
    }

    applyEffect() {
        switch (cardsInfo[this.frontImageIndex].name) {
            case "Pet Rock":
                me.selectedCard.selected = me.selectedCard.focused = false;
                discardPile.add(me.selectedCard);
                me.hand.remove(me.selectedCard);
                effectsToPlay.shift();
                me.points += cardsInfo[me.selectedCard.frontImageIndex].points; 

                if (effectsToPlay.length == 0)
                    gameState = new ScoringPhase();

                break;
            case "Delicious Smoothie":

        }
    }

    toJSON() {
        return { 
            pos: this.pos ? { x: this.pos.x, y: this.pos.y } : null,
            originalPosition: this.originalPosition ? { x: this.originalPosition.x, y: this.originalPosition.y } : null,
            angle: this.angle,
            originalAngle: this.originalAngle,
            width: this.width,
            height: this.height,
            ownerName: this.ownerName,
            frontImageIndex: this.frontImageIndex,
            backImageIndex: this.backImageIndex,
        };
    }

    fromJSON(data) {
        this.pos = data.pos ? createVector(data.pos.x, data.pos.y) : null;
        this.originalPosition = data.originalPosition ? createVector(data.originalPosition.x, data.originalPosition.y) : null;
        this.angle = data.angle;
        this.originalAngle = data.originalAngle;
        this.width = data.width;
        this.height = this.width * 1.4;
        this.ownerName = data.ownerName;
        this.frontImageIndex = data.frontImageIndex;
        this.backImageIndex = data.backImageIndex;
    }
}