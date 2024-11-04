class Player {
    constructor(index, playersInfo) {
        this.index = index;
        this.name = playersInfo[index].name;
        this.angle = (this.index - playersInfo.indexOf(playersInfo.find(info => info.name === myName))) * TWO_PI / playersInfo.length + HALF_PI; 
        this.pos = createVector(width * .5, height * .5).add(p5.Vector.fromAngle(this.angle).mult(sqrt(sq(height * 0.4 * sin(this.angle)) + sq(width * 0.4 * cos(this.angle))))); 
    }

    toJSON() {
        return {
            index: this.index,
            name: this.name,
        };
    }

    fromJSON(data) {
        this.index = data.index;
        this.name = data.name;
    }

    animate() {
        this.angle = (this.index - players.indexOf(players.find(p => p.name === myName))) * TWO_PI / players.length + HALF_PI;
        this.pos = createVector(width * .5, height * .5).add(p5.Vector.fromAngle(this.angle).mult(sqrt(sq(height * 0.4 * sin(this.angle)) + sq(width * 0.4 * cos(this.angle))))); 
    }

    show() {
        push();
        translate(p5.Vector.add(this.pos, p5.Vector.fromAngle(this.angle).mult(sqrt(sq(height * 0.05 * sin(this.angle)) + sq(width * 0.05 * cos(this.angle)))))); 
        rotate(this.angle - HALF_PI);

        rectMode(CENTER);
        stroke(255);
        fill(0);
        rect(0, 0, 50 + this.name.length * 16, 50, 10);

        textSize(40);
        textAlign(CENTER, CENTER);
        noStroke();
        fill(255);
        text(this.name, 0, -5);
        pop();
    }
}
