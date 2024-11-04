class EffectPhase extends PlayPhase {
    constructor() {
        super();
        this.name = 'effect';
        this.effectCardsLoaded = false;
    }

    loadEffectCards() {
        let submittedCards = players.map(p => p.submittedDeck.cards[0]);
        if (submittedCards.some(card => cardsInfo[card.frontImageIndex].name === 'Flaming Chainsaw')) 
            effectCardsToPlay = [];
        else
            effectCardsToPlay = submittedCards
                .filter(card => cardsInfo[card.frontImageIndex].effect && !cardsInfo[card.frontImageIndex].effect.includes('During scoring this round'))
                .sort((a, b) => a.points - b.points)

        this.effectCardsLoaded = true;
    }

    draw() {
        super.draw();

        push();
        fill(255);
        textSize(32);
        textAlign(CENTER);
        text('Effect phase', width / 2, height * 0.3);
        pop();
    }

    update() {
        if (!this.effectCardsLoaded)
            this.loadEffectCards();

        this.currentEffectCard = this.getNextEffectCard();

        if (this.effectCardsLoaded && this.currentEffectCard?.ownerName === me.name)
            this.currentEffectCard?.updateEffect();
    }

    handleClick() {
        if (this.effectCardsLoaded && this.currentEffectCard?.ownerName === me.name) {
            effectCardsToPlay = this.currentEffectCard.clickEffect(effectCardsToPlay);
            sendUpdateToServer();
        }
    }

    getNextEffectCard() {
        if (effectCardsToPlay.length === 0) {
            gameState = new ScoringPhase();
            sendUpdateToServer();
            return;
        }

        let updateEffectFunction = () => {};
        let clickEffectFunction = (effectCardsToPlay) => { return effectCardsToPlay; };
        switch (cardsInfo[effectCardsToPlay[0].frontImageIndex].name) {
            case "Pet Rock":
                updateEffectFunction = () => {
                    me.findHoveredCard();

                    let hoveredCard = me.hand.cards.find(card => card.hovered);
                    if (hoveredCard && cardsInfo[hoveredCard.frontImageIndex].type !== 'score')
                        hoveredCard.hovered = false;

                    for (let card of me.hand.cards)
                        card.checkInteraction();
                };

                clickEffectFunction = (effectCardsToPlay) => {
                    me.hoveredCard = me?.hand.cards.find(card => card.selected);
                    if (!me.hoveredCard || !me.hoveredCard.isOverlapping(createVector(mouseX, mouseY), me.hoveredCard.pos, me.hoveredCard.width, me.hoveredCard.height))
                        return;

                    me.hoveredCard.selected = me.hoveredCard.hovered = false;
                    discardPile.add(me.hoveredCard);
                    me.hand.remove(me.hoveredCard);
                    me.points += cardsInfo[me.hoveredCard.frontImageIndex].points;

                    effectCardsToPlay.shift();
                    gameState.currentEffectCard = gameState.getNextEffectCard();

                    return effectCardsToPlay;
                };
                break;

            case "Delicious Smoothie":
                updateEffectFunction = () => {
                    me.findHoveredCard();

                    for (let card of me.hand.cards)
                        if (cardsInfo[card.frontImageIndex].type === 'score' && cardsInfo[card.frontImageIndex].effect !== null && card.isOverlapping(createVector(mouseX, mouseY), card.originalPosition, card.width, card.height))
                            card.overlap = createVector(mouseX, mouseY).dist(card.originalPosition)

                    for (let card of me.hand.cards)
                        card.checkInteraction();
                };

                clickEffectFunction = (effectCardsToPlay) => {
                    me.hoveredCard = me?.hand.cards.find(card => card.selected);
                    if (!me.hoveredCard || !me.hoveredCard.isOverlapping(createVector(mouseX, mouseY), me.hoveredCard.pos, me.hoveredCard.width, me.hoveredCard.height))
                        return;

                    me.hoveredCard.selected = me.hoveredCard.hovered = false;
                    discardPile.add(me.hoveredCard);
                    me.hand.remove(me.hoveredCard);
                    me.points += cardsInfo[me.hoveredCard.frontImageIndex].points;

                    effectCardsToPlay.shift();
                    gameState.currentEffectCard = gameState.getNextEffectCard();

                    return effectCardsToPlay;
                };
                break;

            case "Fire Spray":
                updateEffectFunction = () => {
                    me.findHoveredCard();

                    for (let card of this.hand.cards)
                        if (myName === this.name && card.isOverlapping(createVector(mouseX, mouseY), card.originalPosition, card.width, card.height))
                            card.overlap = createVector(mouseX, mouseY).dist(card.originalPosition)

                    for (let card of me.hand.cards) {
                        card.checkInteraction();
                        card.animate();
                    }
                };

                clickEffectFunction = (effectCardsToPlay) => {
                    me.hoveredCard.selected = me.hoveredCard.hovered = false;
                    discardPile.add(me.hoveredCard);
                    me.hand.remove(me.hoveredCard);

                    return effectCardsToPlay;
                }
                break;

            case "Dino Grabber":
                updateEffectFunction = () => {

                };

                clickEffectFunction = (effectCardsToPlay) => {
                    for (let player of players)
                        if (player.name !== this.name && player.isOverlapping(createVector(mouseX, mouseY), player.pos, 50)) 
                            player.hand.reveal();

                    return effectCardsToPlay;
                };
                break;
        }

        return {
            ownerName: effectCardsToPlay[0].ownerName,
            updateEffect: updateEffectFunction,
            clickEffect: clickEffectFunction,
        }
    }
}