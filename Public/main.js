let mainDeck, disasterDeck, disasterCard;
let images, dinosaursImages, traitsImages;
let cardsInfo, dinosaursInfo;
let gaegu;
let heroCards = [];
let gameState;
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
    gameState = new ConnectionPhase();
    effectsToPlay = [];

    passButton = new Button(createVector(width * .75, height - 50), width * .06, height * .04, 'PASS'); 
}

function draw() {
    gameState.update()
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

window.addEventListener('click', (event) => {
    gameState.handleClick(event);
})

function fromDisasterToPlay() {
    for (let player of players)
        player.pass = false;

    lowestScorePlayer = players.reduce((min, player) => min?.score < player.score ? min : player, null);
    highestScorePlayer = players.reduce((max, player) => max?.score > player.score ? max : player, null);

    lowestScorePlayer.disasterHand.add(disasterCard.draw());
    let disasters = lowestScorePlayer.disasterHand.cards.map(c => cardsInfo[c.frontImageIndex].categories).flatMap(c => c);
    // if (disasters) {}

    disasterCard.add(disasterDeck.draw());

    highestScorePlayer.points += highestScorePlayer.score;
    for (let player of players) {
        player.score = 0;
        player.points += player.disasterHand.cards.length;
        if (player.points > 50)
            player.win();

        discardPile.add(player.submittedDeck.draw());
        player.hand.fill(mainDeck, cardsPerPlayer);
    }

    gameState = new SelectPhase();
}