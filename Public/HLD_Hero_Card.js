class HeroCard {
    constructor(image, dinosaur, pos, width, square = false) {
        this.image = image;        
        this.pos = pos;
        this.width = width;
        this.square = square;
        this.height = square ? this.width : this.image.height * this.width / this.image.width;
        this.dinosaur = dinosaur;
    }

    update() {
        this.hovered = this.overlap(createVector(mouseX, mouseY));
    }

    show() {
        push();
        imageMode(CENTER, CENTER);
        translate(this.pos);

        let corner_radius = this.width / 32;
        drawingContext.save();
  
        drawingContext.beginPath();
        drawingContext.moveTo(-this.width / 2, -this.height / 2);
        drawingContext.arcTo(this.width / 2, -this.height / 2, this.width / 2, this.height / 2, corner_radius);
        drawingContext.arcTo(this.width / 2, this.height / 2, -this.width / 2, this.height / 2, corner_radius);
        drawingContext.arcTo(-this.width / 2, this.height / 2, -this.width / 2, -this.height / 2, corner_radius);
        drawingContext.arcTo(-this.width / 2, -this.height / 2, this.width / 2, -this.height / 2, corner_radius);
        drawingContext.closePath();
        
        drawingContext.clip();
        if (this.square)
            image(this.image, 0, 0, this.width, this.height, 0, this.image.height * .25, this.image.width, this.image.height * .66);
        else {
            image(this.image, 0, 0, this.width, this.height);
            drawGradientRect(-this.width * .5, -this.height * .5, this.width, this.height * .5);
            textSize(map(this.dinosaur.name.length, 5, 15, this.width * .20, this.width * .10));
            noStroke();
            fill(255);
            textAlign(CENTER, CENTER);
            text(this.dinosaur.name.toUpperCase(), 0, -this.height * .4);

            textSize(this.width * .20);
            let traits = Object.keys(this.dinosaur.traits).map(key => { return { name: key, value: this.dinosaur.traits[key] }; });
            for (let trait of traits) {
                if (this.dinosaur.traits[trait.name] > 0) {
                    image(traits_images[traits.indexOf(trait)], -this.width * .35, this.height * .40, this.width * .12, this.width * .12);
                    text("+" + this.dinosaur.traits[trait.name], -this.width * .18, this.height * .39);
                }

                if (this.dinosaur.traits[trait.name] < 0) {
                    image(traits_images[traits.indexOf(trait)], this.width * .18, this.height * .40, this.width * .12, this.width * .12);
                    text(this.dinosaur.traits[trait.name], this.width * .35, this.height * .39);
                }
            }
        }
        drawingContext.restore();
        
        if (this.hovered) {
            cursor('pointer');
            strokeWeight(2);
            stroke(0, 200, 0);
        } else {
            strokeWeight(1);
            stroke(0);
        }

        noFill();
        rectMode(CENTER, CENTER);
        rect(0, 0, this.width, this.height, this.width / 32);
        pop();
    }

    overlap(pos) {
        return (
            pos.x > this.pos.x - this.width / 2 && 
            pos.x < this.pos.x + this.width / 2 && 
            pos.y > this.pos.y - this.height / 2 &&
            pos.y < this.pos.y + this.height / 2
        )
    }
}

function drawGradientRect(x, y, w, h) {
    strokeWeight(2);
    for (let i = 0; i < h; i++) {
        let alpha = map(i, 0, h, 255, 0);
        
        stroke(0, 0, 0, alpha);
        line(x, y + i, x + w, y + i);
    }
}