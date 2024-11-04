let heroCards = [];
let me;
let readyArr = [];

async function preload() {
    menuBackground = loadImage('Assets/Background/' + Math.floor(Math.random() * 4) + '.jpg');
    logo = loadImage('Assets/logo.png');
    texture = loadImage('Assets/texture.png');
    gaegu = loadFont('Assets/Fonts/Gaegu/Gaegu-Bold.ttf');
    
    await Promise.all([
        fetchFrontImagesInfo(),
        fetchBackImagesInfo(),
        fetchTraitsImages(),
        fetchDinosaursInfo(),
    ]);

    createCards();
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    pixelDensity(3);
    textFont(gaegu);

    textSize(92);
    imageMode(CENTER);

    myName = '';
    players = [];
    cardsPerPlayer = 5;
    animationSpeed = 0.15;
    gameState = new ConnectionPhase();
    effectCardsToPlay = [];

    passButton = new Button(createVector(width * .75, height - 50), width * .06, height * .04, 'PASS'); 
}

function draw() {    
    gameState.update();
    gameState.draw();
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);

    // TODO recalculate all the positions
}

window.addEventListener('click', (event) => {
    gameState.handleClick(event);
})