let versions = [
    "0. Base Game",
    // "1. 5-6 Expansion",
    // "2. Hazards Ahead",
    // "3. Perils of Puberty",
    // "4. Dating Disasters",
    // "5. Exclusive", 
    // "6. Vinyl",
]

let mainDeck, disasterDeck, disasterCard;
let images, dinosaursImages, traitsImages;
let cardsInfo, dinosaursInfo;

const loadImageAsync = (path) => {
    return new Promise((resolve, reject) => {
        const img = loadImage(path, resolve, () => reject(new Error('Failed to load image at ' + path)));
    });
}

const fetchFrontImagesInfo = async () => {
    try {
        let frontImagesInfo = [];
        
        let versions = ["0. Base Game", "1. 5-6 Expansion", "2. Hazards Ahead", "3. Perils of Puberty", "4. Dating Disasters", "5. Exclusive", "6. Vinyl"];
        for (let version of versions) {
            response = await fetch('Assets/Versions/' + version + '/images.json');
            if (!response.ok) 
                throw new Error('Network response was not ok ' + response.statusText);
            frontImagesInfo.push(await response.json());
        }

        const frontImagesPromises = frontImagesInfo.flatMap(info => info.map(info => loadImageAsync(info.path)));
    
        frontImages = await Promise.all(frontImagesPromises);
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}

const fetchBackImagesInfo = async () => {
    try {
        let response = await fetch('Assets/Backs/images.json');
        if (!response.ok) 
            throw new Error('Network response was not ok ' + response.statusText);
        const backImagesInfo = await response.json();
        const backImagesPromises = backImagesInfo.flatMap(info => loadImageAsync(info.path));
    
        backImages = await Promise.all(backImagesPromises);
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}

const fetchTraitsImages = async () => {
    try {
        const response = await fetch('Assets/Traits/traits.json');
        if (!response.ok) 
            throw new Error('Network response was not ok ' + response.statusText);
        const traitsInfo = await response.json();
        const imagesPromises = traitsInfo.map(info => loadImageAsync(info.path))

        traitsImages = await Promise.all(imagesPromises);
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}

const fetchDinosaursInfo = async () => {
    try {
        const response = await fetch('Assets/Versions/0. Base Game/Dinosaurs/dinosaurs.json');
        if (!response.ok) 
            throw new Error('Network response was not ok ' + response.statusText);
        dinosaursInfo = await response.json();
        const imagesPromises = dinosaursInfo.map(dinosaur => loadImageAsync(dinosaur.path))

        dinosaursImages = await Promise.all(imagesPromises);
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}

const createCards = async () => {
    try {
        let disasterCardsInfo = [];
        let disasterCardsVersions = ["0. Base Game", "1. 5-6 Expansion", "2. Hazards Ahead", "3. Perils of Puberty", "4. Dating Disasters", "5. Exclusive", "6. Vinyl"];
        for (let version of disasterCardsVersions.filter(v => versions.includes(v))) {
            let response = await fetch('Assets/Versions/' + version + '/Disaster/disaster.json');
            if (!response.ok) throw new Error('Network response was not ok ' + response.statusText);
            disasterCardsInfo.push(await response.json());
        }
        disasterCardsInfo = disasterCardsInfo.flat();

        let hazardCardsInfo = [];
        let hazardsCardsVersions = ["2. Hazards Ahead"];
        for (let version of hazardsCardsVersions.filter(v => versions.includes(v))) {
            let response = await fetch('Assets/Versions/' + version + '/Hazard/hazard.json');
            if (!response.ok) throw new Error('Network response was not ok ' + response.statusText);
            hazardCardsInfo.push(await response.json());
        }
        hazardCardsInfo = hazardCardsInfo.flat();

        let instantCardsInfo = [];
        let instantCardsVersions = ["0. Base Game", "1. 5-6 Expansion", "2. Hazards Ahead", "3. Perils of Puberty", "4. Dating Disasters"];
        for (let version of instantCardsVersions.filter(v => versions.includes(v))) {
            let response = await fetch('Assets/Versions/' + version + '/Instant/instant.json');
            if (!response.ok) throw new Error('Network response was not ok ' + response.statusText);
            instantCardsInfo.push(await response.json());
        }
        instantCardsInfo = instantCardsInfo.flat();

        let modifierCardsInfo = [];
        let modifierCardsVersions = ["0. Base Game", "1. 5-6 Expansion", "3. Perils of Puberty", "4. Dating Disasters", "5. Exclusive"];
        for (let version of modifierCardsVersions.filter(v => versions.includes(v))) {
            let response = await fetch('Assets/Versions/' + version + '/Modifier/modifier.json');
            if (!response.ok) throw new Error('Network response was not ok ' + response.statusText);
            modifierCardsInfo.push(await response.json());
        }
        modifierCardsInfo = modifierCardsInfo.flat();

        let scoreCardsInfo = [];
        let scoreCardsVersions = ["0. Base Game", "1. 5-6 Expansion", "2. Hazards Ahead", "3. Perils of Puberty", "4. Dating Disasters", "5. Exclusive"];
        for (let version of scoreCardsVersions.filter(v => versions.includes(v))) {
            let response = await fetch('Assets/Versions/' + version + '/Score/score.json');
            if (!response.ok) throw new Error('Network response was not ok ' + response.statusText);
            scoreCardsInfo.push(await response.json());
        }
        scoreCardsInfo = scoreCardsInfo.flat();

        cardsInfo = disasterCardsInfo.concat(hazardCardsInfo).concat(instantCardsInfo).concat(modifierCardsInfo).concat(scoreCardsInfo);
        cardsInfo.sort((a, b) => a.frontImageIndex - b.frontImageIndex);
        const mainDeckCards = cardsInfo
            .filter(info => info.type === 'score' || info.type === 'modifier' || info.type === 'instant')
            .flatMap(info => 
                Array.from({ length: info.copies }, () => new ImageCard(
                    100,
                    info.frontImageIndex,
                    info.backImageIndex
                ))
            );

        const disasterDeckCards = cardsInfo
            .filter(info => info.type === 'disaster')
            .flatMap(info => 
                Array.from({ length: info.copies }, () => new ImageCard(
                    100,
                    info.frontImageIndex,
                    info.backImageIndex
                ))
            );

        const hazardDeckCards = cardsInfo
            .filter(info => info.type === 'hazard')
            .flatMap(info => 
                Array.from({ length: info.copies }, () => new ImageCard(
                    100,
                    info.frontImageIndex,
                    info.backImageIndex
                ))
            );

        mainDeck = new HLDDeck(
            mainDeckCards,
            false,
            createVector(width * .10, height * .20), 
            createVector(width * .10, width * .14)
        );

        disasterDeck = new HLDDeck(
            disasterDeckCards,
            false,
            createVector(width * .25, height * .20), 
            createVector(width * .10, width * .14)
        );

        hazardDeck = new HLDDeck(
            hazardDeckCards,
            false,
            createVector(width * .75, height * .20), 
            createVector(width * .10, width * .14)
        )

        discardPile = new HLDDeck(
            [],
            true,
            createVector(width * .90, height * .20), 
            createVector(width * .10, width * .14)
        );

        disasterCard = new HLDDeck(
            [],
            true, 
            createVector(width * .50, height * .50), 
            createVector(width * .10, width * .14)
        );
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}