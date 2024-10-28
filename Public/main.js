let main_deck, disaster_deck, disaster_card;
let images, dinosaurs_images, traits_images;
let cards_info, dinosaurs_info;
let gaegu;

async function preload() {
    menu_background = loadImage('Assets/Background/' + Math.floor(Math.random() * 4) + '.jpg');
    logo = loadImage('Assets/logo.png');
    texture = loadImage('Assets/texture.png');
    gaegu = loadFont('Assets/Fonts/Gaegu/Gaegu-Bold.ttf');
    
    await Promise.all([
        fetch_front_images_info(),
        fetch_back_images_info(),
        fetch_traits_images(),
        fetch_dinosaurs_info(),
    ]);

    create_cards();
}

function loadImageAsync(path) {
    return new Promise((resolve, reject) => {
        const img = loadImage(path, resolve, () => reject(new Error('Failed to load image at ' + path)));
    });
}

async function fetch_front_images_info() {
    try {
        let front_images_info = [];
        
        let versions = ["0. Base Game", "1. 5-6 Expansion", "2. Hazards Ahead", "3. Perils of Puberty", "4. Dating Disasters", "5. Exclusive", "6. Vinyl"];
        for (let version of versions) {
            response = await fetch('Assets/Versions/' + version + '/images.json');
            if (!response.ok) throw new Error('Network response was not ok ' + response.statusText);
            front_images_info.push(await response.json());
        }

        const front_images_promises = front_images_info.flatMap(info => info.map(info => loadImageAsync(info.path)));
    
        front_images = await Promise.all(front_images_promises);
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}

async function fetch_back_images_info() {
    try {
        let response = await fetch('Assets/Backs/images.json');
        if (!response.ok) throw new Error('Network response was not ok ' + response.statusText);
        let back_images_info = await response.json();

        const back_images_promises = back_images_info.flatMap(info => loadImageAsync(info.path));
    
        back_images = await Promise.all(back_images_promises);
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}

async function fetch_traits_images() {
    try {
        const response = await fetch('Assets/Traits/traits.json');
        if (!response.ok) throw new Error('Network response was not ok ' + response.statusText);

        const traits_info = await response.json();

        const images_promises = traits_info.map(info => {
            return loadImageAsync(info.path);
        })

        traits_images = await Promise.all(images_promises);
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}

async function fetch_dinosaurs_info() {
    try {
        const response = await fetch('Assets/Versions/0. Base Game/Dinosaurs/dinosaurs.json');
        if (!response.ok) throw new Error('Network response was not ok ' + response.statusText);

        dinosaurs_info = await response.json();

        const images_promises = dinosaurs_info.map(dinosaur => {
            return loadImageAsync(dinosaur.path);
        })

        dinosaurs_images = await Promise.all(images_promises);
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}

async function create_cards() {
    try {
        let disaster_cards_info = [];
        let hazard_cards_info = [];
        let instant_cards_info = [];
        let modifier_cards_info = [];
        let score_cards_info = [];
        let response;

        versions = ["0. Base Game", "1. 5-6 Expansion", "2. Hazards Ahead", "3. Perils of Puberty", "4. Dating Disasters", "5. Exclusive", "6. Vinyl"];
        for (let version of versions) {
            response = await fetch('Assets/Versions/' + version + '/Disaster/disaster.json');
            if (!response.ok) throw new Error('Network response was not ok ' + response.statusText);
            disaster_cards_info.push(await response.json());
        }
        disaster_cards_info = disaster_cards_info.flat();

        versions = ["2. Hazards Ahead"];
        for (let version of versions) {
            response = await fetch('Assets/Versions/' + version + '/Hazard/hazard.json');
            if (!response.ok) throw new Error('Network response was not ok ' + response.statusText);
            hazard_cards_info.push(await response.json());
        }
        hazard_cards_info = hazard_cards_info.flat();

        versions = ["0. Base Game", "1. 5-6 Expansion", "2. Hazards Ahead", "3. Perils of Puberty", "4. Dating Disasters"];
        for (let version of versions) {
            response = await fetch('Assets/Versions/' + version + '/Instant/instant.json');
            if (!response.ok) throw new Error('Network response was not ok ' + response.statusText);
            instant_cards_info.push(await response.json());
        }
        instant_cards_info = instant_cards_info.flat();

        versions = ["0. Base Game", "1. 5-6 Expansion", "3. Perils of Puberty", "4. Dating Disasters", "5. Exclusive"];
        for (let version of versions) {
            response = await fetch('Assets/Versions/' + version + '/Modifier/modifier.json');
            if (!response.ok) throw new Error('Network response was not ok ' + response.statusText);
            modifier_cards_info.push(await response.json());
        }
        modifier_cards_info = modifier_cards_info.flat();

        versions = ["0. Base Game", "1. 5-6 Expansion", "2. Hazards Ahead", "3. Perils of Puberty", "4. Dating Disasters", "5. Exclusive"];
        for (let version of versions) {
            response = await fetch('Assets/Versions/' + version + '/Score/score.json');
            if (!response.ok) throw new Error('Network response was not ok ' + response.statusText);
            score_cards_info.push(await response.json());
        }
        score_cards_info = score_cards_info.flat();

        cards_info = disaster_cards_info.concat(hazard_cards_info).concat(instant_cards_info).concat(modifier_cards_info).concat(score_cards_info);
        cards_info.sort((a, b) => a.front_image_index - b.front_image_index);
        const main_deck_cards = cards_info
            .filter(info => info.type == 'score' || info.type == 'modifier' || info.type == 'instant')
            .flatMap(info => 
                Array.from({ length: info.copies }, () => new ImageCard(
                    100,
                    info.front_image_index,
                    info.back_image_index
                ))
            );

        const disaster_deck_cards = cards_info
            .filter(info => info.type == 'disaster')
            .flatMap(info => 
                Array.from({ length: info.copies }, () => new ImageCard(
                    100,
                    info.front_image_index,
                    info.back_image_index
                ))
            );

        const hazard_deck_cards = cards_info
            .filter(info => info.type == 'hazard')
            .flatMap(info => 
                Array.from({ length: info.copies }, () => new ImageCard(
                    100,
                    info.front_image_index,
                    info.back_image_index
                ))
            );

        main_deck = new Deck(
            main_deck_cards,
            false,
            createVector(width * .10, height * .20), 
            createVector(width * .10, width * .14)
        );

        disaster_deck = new Deck(
            disaster_deck_cards,
            false,
            createVector(width * .25, height * .20), 
            createVector(width * .10, width * .14)
        );

        hazard_deck = new Deck(
            hazard_deck_cards,
            false,
            createVector(width * .75, height * .20), 
            createVector(width * .10, width * .14)
        )

        discard_pile = new Deck(
            [],
            true,
            createVector(width * .90, height * .20), 
            createVector(width * .10, width * .14)
        );

        disaster_card = new Deck(
            [],
            true, 
            createVector(width * .50, height * .50), 
            createVector(width * .10, width * .14)
        );
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    pixelDensity(3);
    textFont(gaegu);

    textSize(92);
    imageMode(CENTER);

    my_name = '';
    players = [];
    cards_per_player = 5;
    game_phase = 'connection';
    effect_to_play = [];

    pass_button = new Button(createVector(width * .75, height - 50), width * .06, height * .04, 'PASS'); 
}

function draw() {
    console.log("s")

    if (game_phase == 'connection')
        connection_phase();
    else if (game_phase == 'choice')
        choice_phase();
    else if (game_phase == 'setup')
        setup_phase();
    else if (game_phase == 'play' || game_phase == 'effect' || game_phase == 'scoring' || game_phase == 'disaster')
        play_phase();
}

function connection_phase() {
    let background_height = windowHeight;
    let background_width = menu_background.width / menu_background.height * background_height;
    imageMode(CORNER);
    image(menu_background, 0, 0, background_width, background_height);
    background(0, 127);
    imageMode(CENTER);
    let logo_width = width * .5;
    let logo_height = logo.height / logo.width * logo_width;
    image(logo, width * .66, height * .33, logo_width, logo_height);

    fill(255);
    noStroke();
    let play_btn = document.getElementById('play');
    if (play_btn) {
        play_btn.disabled = document.getElementById('player_name').value.length == 0;
        my_name = document.getElementById('player_name').value;
    } else {
        push();
        textAlign(CENTER);
        textSize(48);
        let text_string = 'Waiting for other players' + '.'.repeat(frameCount / 40 % 4) + " (" + ready.filter(client => client).length + ' / ' + ready.length + ")";
        text(text_string.toUpperCase(), width / 2, height * .80);
        pop();
    }
}

function go_to_choice() {
    document.getElementById('player_name').remove();
    game_phase = 'choice';
}

function start_game(players_info) {
    players = Array.from({ length: players_info.length }, () => null);
    for (let i = 0; i < players_info.length; i++) {
        players[i] = new HLD_Player(i, players_info);
        players[i].hand.fill(main_deck, cards_per_player);
    }

    disaster_card.add(disaster_deck.draw());

    game_phase = 'play';
    frameCount = 0;

    if (my_name == players[0].name)
        send_update_to_server();
}

function choice_phase() {
    for (let x = 0; x <= width + texture.width / 2; x += texture.width / 2)
        for (let y = 0; y <= height + texture.height / 2; y += texture.height / 2)
            image(texture, x, y, texture.width / 2, texture.height / 2);

    let positions = [
        createVector(width * .16, height * .33),
        createVector(width * .16, height * .75),
        createVector(width * .83, height * .33),
        createVector(width * .83, height * .75),
    ]
    hero_cards = dinosaurs_info.map((dinosaur, i) => new HeroCard(
        dinosaurs_images[i],
        dinosaur,
        positions[i],
        height * .34, true
    ));

    cursor('default');
    for (let hero_card of hero_cards) {
        hero_card.update();
        hero_card.show();
    }

    if (hero_cards.some(hero_card => hero_card.hovered)) {
        let selected_hero_card = new HeroCard(
            hero_cards.find(hero_card => hero_card.hovered).image,
            hero_cards.find(hero_card => hero_card.hovered).dinosaur,
            createVector(width * .50, height * .54),
            height * .51
        )

        selected_hero_card.update();
        selected_hero_card.show();
    }

    push();
    textAlign(CENTER);
    textSize(64);
    text('CHOOSE A DINOSAUR', width * .50, height * .10);
    pop();
}

function setup_phase() {
    if (my_name == players[0].name) {
        game_phase = 'play';
        send_update_to_server();
    }
}

function play_phase() {
    for (let x = 0; x <= width + texture.width / 2; x += texture.width / 2)
        for (let y = 0; y <= height + texture.height / 2; y += texture.height / 2)
            image(texture, x, y, texture.width / 2, texture.height / 2);

    disaster_deck.update();
    disaster_deck.show();

    main_deck.update();
    main_deck.show();

    disaster_card.update();
    disaster_card.show();

    hazard_deck.update();
    hazard_deck.show();

    discard_pile.update();
    discard_pile.show();

    let me = players.find(player => player.name == my_name);
    for (let player of players.filter(p => p != me)) {
        player.update();
        player.show();
    }

    me.update();
    me.show();

    if (!me.pass && (game_phase == 'scoring' || game_phase == 'disaster')) {
        pass_button.update();
        pass_button.show();
    }

    push();
    fill(255);
    textSize(32);
    textAlign(CENTER);
    let dots = '.'.repeat(frameCount / 30 % 4)
    let text_string;
    switch (game_phase) {
        case 'play':
            if (!me.submitted)
                text_string = 'Play a card';
            else
                text_string = 'Waiting for the other players' + dots + " (" + players.filter(p => p.submitted).length + " / " + players.length + ")";
            break;
        case 'effect':
            text_string = 'Effect phase';
            break;
        case 'scoring':
            text_string = 'Scoring phase';
            break;
        case 'disaster':
            text_string = 'Disaster phase';
            break;
    }
    text(text_string, width / 2, height * 0.3);
    pop();
}

function send_update_to_server() {
    socket.send(JSON.stringify({ 
        type: 'update',
        phase: game_phase, 
        main_deck: main_deck.toJSON(),
        disaster_deck: disaster_deck.toJSON(),
        disaster_card: disaster_card.toJSON(),
        discard_pile: discard_pile.toJSON(),
        effect_to_play: effect_to_play,
        players: players.map(p => p.toJSON()),
    }));
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function mouseClicked() {
    let me = players.find(player => player.name == my_name);
    let selected_card = me?.hand.cards.find(card => card.selected);
    if (!selected_card || !selected_card.overlap(createVector(mouseX, mouseY), selected_card.pos, selected_card.width, selected_card.height)) {
        if (!pass_button.overlap(createVector(mouseX, mouseY)))
            return;

        if (game_phase == 'scoring') {
            me.pass = true;

            if (players.every(p => p.pass)) {
                for (let player of players)
                    player.pass = false;

                game_phase = 'disaster';

                let loser = players.reduce((min, player) => min?.score < player.score ? min : player, null);
                if (!loser.hand.cards.some(c => cards_info[c.front_image_index].type == 'instant'))
                    from_disaster_to_play();
            }
        } else if (game_phase == 'disaster') {
            me.pass = true;
            let loser = players.reduce((min, player) => min?.score < player.score ? min : player, null);

            if (loser.pass)
                from_disaster_to_play();
        }

        send_update_to_server();
        return;
    }

    if (game_phase == 'play') {
        if (!me.submitted) {
            selected_card.selected = selected_card.focused = false;
            me.submitted_deck.add(selected_card);
            me.hand.remove(selected_card);
            me.submitted = true;
            me.points = cards_info[selected_card.front_image_index].points;

            if (players.every(p => p.submitted)) {
                for (let player of players) {
                    player.submitted_deck.face_up = true;
                    player.submitted = false;
                }

                game_phase = 'effect';
                if (players.some(p => cards_info[p.submitted_deck.cards[0].front_image_index].name == 'Flaming Chainsaw')) 
                    effect_to_play = [];
                else
                    effect_to_play = players
                    .map(p => p.submitted_deck.cards[0])
                    .filter(c => cards_info[c.front_image_index].effect && !cards_info[c.front_image_index].effect.includes('During scoring this round'))
                    .sort((a, b) => cards_info[a.front_image_index].points - cards_info[b.front_image_index].points)
                    .map(c => new Object({ name: cards_info[c.front_image_index].name, owner_name: c.owner_name }));
            
                if (effect_to_play.length == 0)
                    game_phase = 'scoring';
            }
        }
    } else if (game_phase == 'effect') {
        let effect_card = effect_to_play[0];
        if (effect_card.owner_name == me.name) {
            if (effect_card.name == "Pet Rock" || effect_card.name == "Delicious Smoothie") {
                selected_card.selected = selected_card.focused = false;
                discard_pile.add(selected_card);
                me.hand.remove(selected_card);
                effect_to_play.shift();
                me.points += cards_info[selected_card.front_image_index].points; 

                if (effect_to_play.length == 0)
                    game_phase = 'scoring';
            }
        }
    } else if (game_phase == 'scoring') {
        if (selected_card.selected) {
            selected_card.selected.points += info_cards[selected_card.front_image_index].modifier;
            selected_card.selected = selected_card.focused = false;
            discard_pile.add(selected_card);
            me.hand.remove(selected_card);
        }
    } else if (game_phase == 'disaster') {
        if (selected_card.selected) {
            if (selected_card.name == 'Disaster Insurance') {
                selected_card.selected = selected_card.focused = false;
                discard_pile.add(selected_card);
                me.hand.remove(selected_card);
            } else if (selected_card.name == 'Disaster Redirect') {
                // selected_card.selected = selected_card.focused = false;
                // discard_pile.add(selected_card);
                // me.hand.remove(selected_card);
            }
        }
    }

    send_update_to_server();
}

function from_disaster_to_play() {
    for (let player of players)
        player.pass = false;

    lowest_score_player = players.reduce((min, player) => min?.score < player.score ? min : player, null);
    highest_score_player = players.reduce((max, player) => max?.score > player.score ? max : player, null);

    lowest_score_player.disaster_hand.add(disaster_card.draw());
    let disasters = lowest_score_player.disaster_hand.cards.map(c => cards_info[c.front_image_index].categories).flatMap(c => c);
    if (disasters) {

    }

    disaster_card.add(disaster_deck.draw());

    highest_score_player.points += highest_score_player.score;
    for (let player of players) {
        player.score = 0;
        player.points += player.disaster_hand.cards.length;
        if (player.points > 50)
            player.win();

        discard_pile.add(player.submitted_deck.draw());
        player.hand.fill(main_deck, cards_per_player);
    }

    game_phase = 'play';
}