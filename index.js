const particleSize = 5;
var penSize = 5;
var currentParticle = Sand;
var paused = false;

var canvas = document.getElementById("canvas");
canvas.width = Math.floor(window.innerWidth / particleSize) * particleSize;
canvas.height = Math.floor(window.innerHeight / particleSize) * particleSize;
var ctx = canvas.getContext("2d");

// INITIALIZING THE PIXEL MAP
var pixelMap = [];
for (var x = 0; x < (canvas.width / particleSize); x++) {
    var pixelMapColumn = [];
    for (var y = 0; y < (canvas.height / particleSize); y++) {
        pixelMapColumn.push(0);
    }
    pixelMap.push(pixelMapColumn);
}
console.log(pixelMap.length == pixelMap[pixelMap.length - 1].length);

var mousePos = {x: 0, y: 0};
canvas.addEventListener("mousemove", (e) => {
    // Get the bounding rectangle of target
    const rect = e.target.getBoundingClientRect();

    // Mouse position
    mousePos.x = Math.floor((e.clientX - rect.left)/particleSize);
    mousePos.y = Math.floor((e.clientY - rect.top)/particleSize);

    if (mouseDown) {
        for (var x = mousePos.x; x < mousePos.x+penSize; x++) {
            for (var y = mousePos.y; y < mousePos.y+penSize; y++) {
                pixelMap[x][y] = new currentParticle();
            }
        }
    }
});

var mouseDown = false;
canvas.addEventListener("mousedown", () => {mouseDown = true});
canvas.addEventListener("mouseup", () => {mouseDown = false});

document.body.addEventListener("keypress", (e) => {
    e.preventDefault();
    switch (e.key) {
        case " ":
            paused = !paused;
            break;
        case "1":
            currentParticle = Sand;
            break;
        case "2":
            currentParticle = Water;
            break;
        case "3":
            currentParticle = Acid;
            break;
        case "4":
            currentParticle = Wood;
            break;
        case "5":
            currentParticle = Fire;
            break;
        case "6":
            currentParticle = Smoke;
            break;
    }
});

// (DONE): Convert the particle dictionaries to classes for each type of particle.

var lastDeltaTime = 0;
var fireTicker = 0;
var fireSpreadChance = 0.8;

var update = () => {
    // PHYSICS CODE
    for (var y = ((canvas.height / particleSize)-1); y > -1; y--) {
        if (paused) break;
        for (var x = ((canvas.width / particleSize)-1); x > -1; x--) {
            if (pixelMap[x][y] == 0) continue;

            // SAND CODE
            else if (pixelMap[x][y].type == 1 && y < ((canvas.height / particleSize)-1)) {
                // MOVING THROUGH AIR
                if (pixelMap[x][y+1] == 0) {
                    var distance = 0;
                    for (var y2 = y+1; y2 < y+pixelMap[x][y].speed+1; y2++) {
                        if (pixelMap[x][y2] != 0) break;
                        distance++;
                    }
                    pixelMap[x][y+distance] = new Sand();
                    pixelMap[x][y] = 0;
                }
                else if (Math.random() < 0.3 && !(pixelMap[x][y+1].isFluid)) continue;
                // else if ((x < ((canvas.width / particleSize)-1) && pixelMap[x+1][y+1] == 0) && (x > 0 && pixelMap[x-1][y+1] == 0)) {
                //     if (Math.random() < 0.5) {
                //         pixelMap[x+1][y+1] = new Sand();
                //         pixelMap[x][y] = 0;
                //     }
                //     else {
                //         pixelMap[x-1][y+1] = new Sand();
                //         pixelMap[x][y] = 0;
                //     }
                // }
                else if (x < ((canvas.width / particleSize)-1) && pixelMap[x+1][y+1] == 0) {
                    pixelMap[x+1][y+1] = new Sand();
                    pixelMap[x][y] = 0;
                }
                else if (x > 0 && pixelMap[x-1][y+1] == 0) {
                    pixelMap[x-1][y+1] = new Sand();
                    pixelMap[x][y] = 0;
                }

                // MOVING THROUGH WATER
                else if (pixelMap[x][y+1].type == 2) {
                    var oldPixel = pixelMap[x][y+1];
                    pixelMap[x][y+1] = pixelMap[x][y];
                    pixelMap[x][y-(Math.random() < 0.15 ? 25 : 1)] = oldPixel;
                    pixelMap[x][y] = oldPixel;
                }
                // else if ((x < ((canvas.width / particleSize)-1) && pixelMap[x+1][y+1].type == 2) && (x > 0 && pixelMap[x-1][y+1].type == 2)) {
                //     if (Math.random() < 0.5) {
                //         pixelMap[x+1][y+1] = new Sand();
                //         pixelMap[x][y] = new Water();
                //     }
                //     else {
                //         pixelMap[x-1][y+1] = new Sand();
                //         pixelMap[x][y] = new Water();
                //     }
                // }
                else if (x < ((canvas.width / particleSize)-1) && pixelMap[x+1][y+1].type == 2) {
                    pixelMap[x+1][y+1] = new Sand();
                    pixelMap[x][y] = new Water();
                }
                else if (x > 0 && pixelMap[x-1][y+1].type == 2) {
                    pixelMap[x-1][y+1] = new Sand();
                    pixelMap[x][y] = new Water();
                }
            }

            //WATER CODE
            else if (pixelMap[x][y].type == 2 && y < ((canvas.height / particleSize)-1)) {
                if (pixelMap[x][y+1] == 0) {
                    var distance = 0;
                    for (var y2 = y+1; y2 < y+pixelMap[x][y].speed+1; y2++) {
                        if (pixelMap[x][y2] != 0) break;
                        distance++;
                    }
                    pixelMap[x][y+distance] = new Water();
                    pixelMap[x][y] = 0;
                }
                // else if ((x < ((canvas.width / particleSize)-1) && pixelMap[x+1][y] == 0) && (x > 0 && pixelMap[x-1][y] == 0)) {
                //     if (Math.random() < 0.5) {
                //         pixelMap[x+1][y] = {type: 2, speed: particleSpeed.water};
                //         pixelMap[x][y] = 0;
                //     }
                //     else {
                //         pixelMap[x-1][y] = {type: 2, speed: particleSpeed.water};
                //         pixelMap[x][y] = 0;
                //     }
                // }
                // else if ((x < ((canvas.width / particleSize)-1) && pixelMap[x+1][y+1] == 0) && (x > 0 && pixelMap[x-1][y+1] == 0)) {
                //     if (Math.random() < 0.5) {
                //         pixelMap[x+1][y+1] = {type: 2, speed: particleSpeed.water};
                //         pixelMap[x][y] = 0;
                //     }
                //     else {
                //         pixelMap[x-1][y+1] = {type: 2, speed: particleSpeed.water};
                //         pixelMap[x][y] = 0;
                //     }
                // }
                else if (x > 0 && pixelMap[x-1][y] == 0) {
                    pixelMap[x-1][y] = new Water();
                    pixelMap[x][y] = 0;
                }
                else if (x < ((canvas.width / particleSize)-1) && pixelMap[x+1][y] == 0) {
                    pixelMap[x+1][y] = new Water();
                    pixelMap[x][y] = 0;
                }
                else if (x < ((canvas.width / particleSize)-1) && pixelMap[x+1][y+1] == 0) {
                    pixelMap[x+1][y+1] = new Water();
                    pixelMap[x][y] = 0;
                }
                else if (x > 0 && pixelMap[x-1][y+1] == 0) {
                    pixelMap[x-1][y+1] = new Water();
                    pixelMap[x][y] = 0;
                }
            }

            //ACID CODE
            else if (pixelMap[x][y].type == 3 && y < ((canvas.height / particleSize)-1)) {
                // MOVEMENT CODE
                if (pixelMap[x][y+1] == 0) {
                    var distance = 0;
                    for (var y2 = y+1; y2 < y+pixelMap[x][y].speed+1; y2++) {
                        if (pixelMap[x][y2] != 0) break;
                        distance++;
                    }
                    pixelMap[x][y+distance] = new Acid();
                    pixelMap[x][y] = 0;
                }

                else if (pixelMap[x][y+1] != 0 && pixelMap[x][y+1].type != 3) {
                    pixelMap[x][y+1] = 0;
                    pixelMap[x][y] = 0;
                }

                else if (x > 0 && pixelMap[x-1][y] == 0) {
                    pixelMap[x-1][y] = new Acid();
                    pixelMap[x][y] = 0;
                }
                else if (x < ((canvas.width / particleSize)-1) && pixelMap[x+1][y] == 0) {
                    pixelMap[x+1][y] = new Acid();
                    pixelMap[x][y] = 0;
                }
                else if (x < ((canvas.width / particleSize)-1) && pixelMap[x+1][y+1] == 0) {
                    pixelMap[x+1][y+1] = new Acid();
                    pixelMap[x][y] = 0;
                }
                else if (x > 0 && pixelMap[x-1][y+1] == 0) {
                    pixelMap[x-1][y+1] = new Acid();
                    pixelMap[x][y] = 0;
                }

                // MELT CODE
                else if (pixelMap[x][y-1] != 0 && pixelMap[x][y-1].type != 3) {
                    pixelMap[x][y-1] = 0;
                    pixelMap[x][y] = 0;
                }
                else if (x < ((canvas.width / particleSize)-1) && pixelMap[x+1][y+1] != 0 && pixelMap[x+1][y+1].type != 3) {
                    pixelMap[x+1][y+1] = 0;
                    pixelMap[x][y] = 0;
                }
                else if (x > 0 && pixelMap[x-1][y+1] != 0 && pixelMap[x-1][y+1].type != 3) {
                    pixelMap[x-1][y+1] = 0;
                    pixelMap[x][y] = 0;
                }
                else if (x > 0 && pixelMap[x-1][y] != 0 && pixelMap[x-1][y].type != 3) {
                    pixelMap[x-1][y] = 0;
                    pixelMap[x][y] = 0;
                }
                else if (x < ((canvas.width / particleSize)-1) && pixelMap[x+1][y] != 0 && pixelMap[x+1][y].type != 3) {
                    pixelMap[x+1][y] = 0;
                    pixelMap[x][y] = 0;
                }
                else if (x < ((canvas.width / particleSize)-1) && pixelMap[x+1][y-1] != 0 && pixelMap[x+1][y-1].type != 3) {
                    pixelMap[x+1][y-1] = 0;
                    pixelMap[x][y] = 0;
                }
                else if (x > 0 && pixelMap[x-1][y-1] != 0 && pixelMap[x-1][y-1].type != 3) {
                    pixelMap[x-1][y-1] = 0;
                    pixelMap[x][y] = 0;
                }
            }

            //FIRE CODE
            else if (pixelMap[x][y].type == 5 && y < ((canvas.height / particleSize)-1) && fireTicker == 0) {
                if (Math.random() < fireSpreadChance) {
                    if (pixelMap[x][y+1].type == 4) {
                        pixelMap[x][y+1] = new Fire();
                    }
                    if (pixelMap[x][y-1].type == 4) {
                        pixelMap[x][y-1] = new Fire();
                    }
                    if (x < ((canvas.width / particleSize)-1) && pixelMap[x+1][y+1].type == 4) {
                        pixelMap[x+1][y+1] = new Fire();
                    }
                    if (x > 0 && pixelMap[x-1][y+1].type == 4) {
                        pixelMap[x-1][y+1] = new Fire();
                    }
                    if (x > 0 && pixelMap[x-1][y].type == 4) {
                        pixelMap[x-1][y] = new Fire();
                    }
                    if (x < ((canvas.width / particleSize)-1) && pixelMap[x+1][y].type == 4) {
                        pixelMap[x+1][y] = new Fire();
                    }
                    if (x < ((canvas.width / particleSize)-1) && pixelMap[x+1][y-1].type == 4) {
                        pixelMap[x+1][y-1] = new Fire();
                    }
                    if (x > 0 && pixelMap[x-1][y-1].type == 4) {
                        pixelMap[x-1][y-1] = new Fire();
                    }

                    if (pixelMap[x][y-1] == 0) {
                        pixelMap[x][y-1] = new Smoke();
                    }
                }
                else {
                    pixelMap[x][y] = 0;
                }
            }
        }
    }

    for (var y = 0; y < ((canvas.height / particleSize)-1); y++) {
        if (paused) break;
        for (var x = 0; x < ((canvas.width / particleSize)-1); x++) {
            //SMOKE CODE
            if (pixelMap[x][y].type == 6 && y < ((canvas.height / particleSize)-1)) {
                if (Math.random() < 0.9) {
                    if (y <= 1) {
                        pixelMap[x][y] = 0;
                    }
                    else if (pixelMap[x][y-1] == 0) {
                        pixelMap[x][y-1] = new Smoke();
                        pixelMap[x][y] = 0;
                    }
                    else if (x > 0 && pixelMap[x-1][y] == 0) {
                        pixelMap[x-1][y] = new Smoke();
                        pixelMap[x][y] = 0;
                    }
                    else if (x < ((canvas.width / particleSize)-1) && pixelMap[x+1][y] == 0) {
                        pixelMap[x+1][y] = new Smoke();
                        pixelMap[x][y] = 0;
                    }
                    else if (x < ((canvas.width / particleSize)-1) && pixelMap[x+1][y-1] == 0) {
                        pixelMap[x+1][y-1] = new Smoke();
                        pixelMap[x][y] = 0;
                    }
                    else if (x > 0 && pixelMap[x-1][y-1] == 0) {
                        pixelMap[x-1][y-1] = new Smoke();
                        pixelMap[x][y] = 0;
                    }
                    else if (pixelMap[x][y+1] == 0) {
                        pixelMap[x][y+1] = new Smoke();
                        pixelMap[x][y] = 0
                    }
                }
                else {
                    pixelMap[x][y] = 0;
                }
            }
        }
    }
    
    fireTicker++;
    if (fireTicker == 3) fireTicker = 0;

    // DRAW CODE
    ctx.fillStyle = "#f1e4e4";
    ctx.fillRect(0, 0, canvas.width, canvas.height*2);

    for (var x = 0; x < (canvas.width / particleSize); x++) {
        for (var y = 0; y < (canvas.height / particleSize); y++) {
            if (pixelMap[x][y] == 0) continue;
            ctx.fillStyle = pixelMap[x][y].color;
            ctx.fillRect(x*particleSize, y*particleSize, particleSize, particleSize);
        }
    }
    lastDeltaTime += 1;
    requestAnimationFrame(update);
}

update();

var FPS = 0;
setInterval(() => {
    FPS = lastDeltaTime;
    lastDeltaTime = 0;
}, 1000);