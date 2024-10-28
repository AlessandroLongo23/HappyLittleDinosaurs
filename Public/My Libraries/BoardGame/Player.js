class Player {
    constructor(index, players_info) {
        this.index = index;
        this.name = players_info[index].name;
        this.angle = (this.index - players_info.indexOf(players_info.find(info => info.name == my_name))) * TWO_PI / players_info.length + HALF_PI; 
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

    update() {
        this.angle = (this.index - players.indexOf(players.find(p => p.name == my_name))) * TWO_PI / players.length + HALF_PI;
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
