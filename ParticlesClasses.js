class Particle {
    constructor(color, isFluid) {
        this.color = color;
        this.isFluid = isFluid; // Fluids refers to air and all liquids that solid objects 
    }
}

class Sand extends Particle {
    constructor() {
        super("#e3b464", false);
        this.type = 1;
        this.speed = 3;
    }
}

class Water extends Particle {
    constructor() {
        super("#0749b3", true);
        this.type = 2;
        this.speed = 4;
        this.xDirection = Math.random() < 0.5 ? -1 : 1;
    }
}

class Acid extends Particle {
    constructor() {
        super("#cede15", true);
        this.type = 3;
        this.speed = 1;
        this.xDirection = Math.random() < 0.5 ? -1 : 1;
    }
}

class Wood extends Particle {
    constructor() {
        super("#674f48", false);
        this.type = 4;
        this.speed = 0;
    }
}

class Fire extends Particle {
    constructor() {
        super("#f58c59", false);
        this.type = 5;
        this.speed = 1;
    }
}

class Smoke extends Particle {
    constructor() {
        super("#736c6c", false);
        this.type = 6;
        this.speed = 1;
    }
}


const particleTypeToClass = [
    0,
    Sand,
    Water,
    Acid,
    Wood
];