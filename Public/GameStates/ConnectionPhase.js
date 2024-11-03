class ConnectionPhase extends GameState {
    constructor() {
        super();
        this.name = 'connection';
    }

    update() {
        let backgroundHeight = windowHeight;
        let backgroundWidth = menuBackground.width / menuBackground.height * backgroundHeight;
        imageMode(CORNER);
        image(menuBackground, 0, 0, backgroundWidth, backgroundHeight);
        background(0, 127);
        imageMode(CENTER);
        
        let logoWidth = width * .5;
        let logoHeight = logo.height / logo.width * logoWidth;
        image(logo, width * .66, height * .33, logoWidth, logoHeight);
    
        fill(255);
        noStroke();
        let playButton = document.getElementById('play');
        if (playButton) {
            playButton.disabled = document.getElementById('playerName').value.length == 0;
            myName = document.getElementById('playerName').value;
        } else {
            push();
            textAlign(CENTER);
            textSize(48);
            let textString = 'Waiting for other players' + '.'.repeat(frameCount / 40 % 4) + " (" + readyArr.filter(client => client).length + ' / ' + readyArr.length + ")";
            text(textString.toUpperCase(), width / 2, height * .80);
            pop();
        }
    }

    handleClick(event) {
        if (event.target.id == 'play') {
            socket.send(JSON.stringify({ type: 'ready', readyArray: readyArr }));
            document.getElementById('playerName').disabled = true;
        }
    }
}

window.addEventListener('keyup', _ => {
    if (gameState instanceof ConnectionPhase)
        socket.send(JSON.stringify({ type: 'name', name: document.getElementById('playerName').value })); 
});