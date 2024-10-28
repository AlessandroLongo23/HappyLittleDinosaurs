class Card {
    constructor(width = 200) {
        this.pos = createVector();
        this.target_pos = createVector();
        this.angle = 0;
        this.width = width;
        this.height = this.width * 1.4;
        this.owner_name = null;
    }

    toJSON() {
        return { 
            pos: this.pos ? { x: this.pos.x, y: this.pos.y } : null,
            original_pos: this.original_pos ? { x: this.original_pos.x, y: this.original_pos.y } : null,
            width: this.width,
            height: this.height,
            angle: this.angle,
            original_angle: this.original_angle,
            owner_name: this.owner_name,
        };
    }

    fromJSON(data) {
        this.pos = data.pos ? createVector(data.pos.x, data.pos.y) : null;
        this.original_pos = data.original_pos ? createVector(data.original_pos.x, data.original_pos.y) : null;
        this.width = data.width;
        this.height = this.width * 1.4;
        this.angle = data.angle;
        this.original_angle = data.original_angle;
        this.owner_name = data.owner_name;
    }

    update() {
        if (this.target_angle != null) 
            this.angle += (this.target_angle - this.angle) * 0.1;
        
        if (this.target_width != null) {
            this.width += (this.target_width - this.width) * 0.1;
            this.height = this.width * 1.4;
        }

        if (this.target_pos != null) 
            this.pos.add(p5.Vector.sub(this.target_pos, this.pos).mult(0.1));
    }
}