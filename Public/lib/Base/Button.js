class Button {
    constructor(pos, width, height, text) {
        this.pos = pos;
        this.width = width;
        this.height = height;
        this.text = text;
    }

    toJSON() {
        return {
            pos: this.pos ? { x: this.pos.x, y: this.pos.y } : null,
            width: this.width,
            height: this.height,
            text: this.text,
            callback: this.callback,
        };
    }

    fromJSON(data) {
        this.pos = data.pos ? createVector(data.pos.x, data.pos.y) : null;
        this.width = data.width;
        this.height = data.height;
        this.text = data.text;
        this.callback = data.callback;
    }

    update() {
        this.hovered = this.isOverlapping(createVector(mouseX, mouseY));
    }

    isOverlapping(pos) {
        return (
            pos.x > this.pos.x - this.width / 2 && 
            pos.x < this.pos.x + this.width / 2 && 
            pos.y > this.pos.y - this.height / 2 &&
            pos.y < this.pos.y + this.height / 2
        )
    }

    show() {
        cursor(this.hovered ? 'pointer' : 'default');

        push();
        strokeWeight(1);
        stroke(0);
        fill(this.hovered ? color(200) : color(255));

        rectMode(CENTER, CENTER);
        rect(this.pos.x, this.pos.y, this.width, this.height, this.height / 8);

        textAlign(CENTER);
        noStroke();
        fill(0);
        textSize(this.height * .75);
        text(this.text, this.pos.x, this.pos.y + 10);
        pop();
    }
}