class Card {
    constructor(width = 200) {
        this.pos = createVector();
        this.targetPosition = createVector();
        this.angle = 0;
        this.width = width;
        this.height = this.width * 1.4;
        this.ownerName = null;
    }

    toJSON() {
        return { 
            pos: this.pos ? { x: this.pos.x, y: this.pos.y } : null,
            originalPosition: this.originalPosition ? { x: this.originalPosition.x, y: this.originalPosition.y } : null,
            width: this.width,
            height: this.height,
            angle: this.angle,
            originalAngle: this.originalAngle,
            ownerName: this.ownerName,
        };
    }

    fromJSON(data) {
        this.pos = data.pos ? createVector(data.pos.x, data.pos.y) : null;
        this.originalPosition = data.originalPosition ? createVector(data.originalPosition.x, data.originalPosition.y) : null;
        this.width = data.width;
        this.height = this.width * 1.4;
        this.angle = data.angle;
        this.originalAngle = data.originalAngle;
        this.ownerName = data.ownerName;
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
}