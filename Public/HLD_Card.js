class ImageCard extends Card {
    constructor(width, front_image_index, back_image_index) {
        super(width);
        this.front_image_index = front_image_index;
        this.back_image_index = back_image_index;
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

    overlap(a, b, w, h) {
        return (
            a.x > b.x - w / 2 && 
            a.x < b.x + w / 2 && 
            a.y > b.y - h / 2 &&
            a.y < b.y + h / 2
        )
    }

    check_interaction() {
        this.target_width = this.original_width;
        this.target_angle = this.original_angle;
        this.target_pos = this.original_pos;

        if (this.focused)
            this.target_pos.set(p5.Vector.add(this.original_pos, p5.Vector.fromAngle(this.angle - HALF_PI).mult(this.height * .5)));

        if (game_phase == 'play' || game_phase == 'effect') {
            this.selected = (
                this.focused && 
                this.pos.dist(this.target_pos) < 5 &&
                this.overlap(createVector(mouseX, mouseY), this.pos, this.width, this.height)
            )
        } else if (game_phase == 'scoring') {
            this.selected = (
                this.pos.dist(this.target_pos) < 5 &&
                this.overlap(createVector(mouseX, mouseY), this.pos, this.width, this.height)
            )

            let min_dist = float('inf');
            this.selected = null;
            for (let player of players) {
                let d = player.pos.dist(createVector(mouseX, mouseY));
                if (d < height * .25 && d < min_dist) {
                    this.selected = player;
                    min_dist = d;
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

        let corner_radius = this.height / 32;
        drawingContext.save();
        drawingContext.beginPath();
        drawingContext.moveTo(-this.width / 2, -this.height / 2);
        drawingContext.arcTo(this.width / 2, -this.height / 2, this.width / 2, this.height / 2, corner_radius);
        drawingContext.arcTo(this.width / 2, this.height / 2, -this.width / 2, this.height / 2, corner_radius);
        drawingContext.arcTo(-this.width / 2, this.height / 2, -this.width / 2, -this.height / 2, corner_radius);
        drawingContext.arcTo(-this.width / 2, -this.height / 2, this.width / 2, -this.height / 2, corner_radius);
        drawingContext.closePath();
        drawingContext.clip();
        image(this.face_up ? front_images[this.front_image_index] : back_images[this.back_image_index], 0, 0, this.width, this.height);
        drawingContext.restore();

        fill(0, disabled ? 127 : 0);
        rect(0, 0, this.width, this.height, corner_radius);

        pop();
    }

    toJSON() {
        return { 
            pos: this.pos ? { x: this.pos.x, y: this.pos.y } : null,
            original_pos: this.original_pos ? { x: this.original_pos.x, y: this.original_pos.y } : null,
            angle: this.angle,
            original_angle: this.original_angle,
            width: this.width,
            height: this.height,
            owner_name: this.owner_name,
            front_image_index: this.front_image_index,
            back_image_index: this.back_image_index,
        };
    }

    fromJSON(data) {
        this.pos = data.pos ? createVector(data.pos.x, data.pos.y) : null;
        this.original_pos = data.original_pos ? createVector(data.original_pos.x, data.original_pos.y) : null;
        this.angle = data.angle;
        this.original_angle = data.original_angle;
        this.width = data.width;
        this.height = this.width * 1.4;
        this.owner_name = data.owner_name;
        this.front_image_index = data.front_image_index;
        this.back_image_index = data.back_image_index;
    }
}