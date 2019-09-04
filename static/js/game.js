function rotateCards() {
    document.querySelector("#left").style.transform = "rotate(90deg)";
    document.querySelector("#right").style.transform = "rotate(270deg)";
    document.querySelector("#top").style.transform = "rotate(180deg)";
}

rotateCards();

function shuffleDeck() {
    const cards = ['C02', 'C03', 'C04', 'C05', 'C06', 'C07', 'C08', 'C09', 'C10', 'C11', 'C12', 'C13', 'C14',
                   'D02', 'D03', 'D04', 'D05', 'D06', 'D07', 'D08', 'D09', 'D10', 'D11', 'D12', 'D13', 'D14',
                   'H02', 'H03', 'H04', 'H05', 'H06', 'H07', 'H08', 'H09', 'H10', 'H11', 'H12', 'H13', 'H14',
                   `S02`, 'S03', 'S04', 'S05', 'S06', 'S07', 'S08', 'S09', 'S10', 'S11', 'S12', 'S13', 'S14'];
  let currentIndex = cards.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = cards[currentIndex];
    cards[currentIndex] = cards[randomIndex];
    cards[randomIndex] = temporaryValue;
  }

  return cards;
}



function dealCards(numberOfCards){

    let shuffledDeck = shuffleDeck();
    let Player1Cards = [];
    let Player2Cards = [];
    let Player3Cards = [];
    let Player4Cards = [];
    for(let i = 0; i < numberOfCards; i++ ){
        Player1Cards.push(shuffledDeck.shift());
        Player2Cards.push(shuffledDeck.shift());
        Player3Cards.push(shuffledDeck.shift());
        Player4Cards.push(shuffledDeck.shift());
    }
    Player1Cards = Player1Cards.sort();
    Player2Cards = Player2Cards.sort();
    Player3Cards = Player3Cards.sort();
    Player4Cards = Player4Cards.sort();

    let trump = shuffledDeck.shift();

    return {'Player1': Player1Cards, 'Player2': Player2Cards, 'Player3': Player3Cards, 'Player4': Player4Cards,
            'Deck': shuffledDeck, 'trump': trump};
}

function displayPlayerHands(cards){
    localStorage.setItem("cards", JSON.stringify(cards));
    let names = getPlayers()
    showPlayerTurn(names[getPlayer()]);
    let cardsOfPlayer = cards[getPlayer()];
    let rootSrc = '../static/images/cards/';
    let players = ['#top', '#left', '#right', '#player'];
    let numberOfCards = cardsOfPlayer.length;
    for( let player of players){
        let PlayerHtml = document.querySelector(player);
        PlayerHtml.innerHTML = '';
        for(let i = 0; i < numberOfCards; i++){

            const card = document.createElement('img');
            card.classList.add('card');
            if(player === '#player'){
                card.addEventListener("click", playCard);
                card.setAttribute('src',rootSrc + cardsOfPlayer[i] + '.svg');
                card.setAttribute('data-card', cardsOfPlayer[i]);
                card.setAttribute('data-player', getPlayer());
            }
            else{
                card.setAttribute('src',rootSrc + 'BLUE_BACK.svg');
            }
            PlayerHtml.appendChild(card);
        }
    }
}


function displayDeck(Deck){
    let rootSrc = '../static/images/cards/';
    let deckSize = Deck.length;
    let deckHtml = document.querySelector('.deck');
    deckHtml.innerHTML = '';
    for(let i = 0; i < deckSize; i++){
        const card = document.createElement('img');
        card.classList.add('card');
        card.setAttribute('src',rootSrc + 'BLUE_BACK.svg');
        deckHtml.appendChild(card);
    }

}

function displayTrump(trump){
    let rootSrc = '../static/images/cards/';
    let trumpHtml = document.querySelector('.trump');
    trumpHtml.innerHTML = '';
    const card = document.createElement('img');
    card.classList.add('card');
    card.setAttribute('src',rootSrc + trump + '.svg');
    trumpHtml.appendChild(card);
}

// let Cards = dealCards(12);
// displayTrump(Cards.trump);
// displayDeck(Cards.Deck);
// displayPlayerHands(Cards.Player1);


function getBets(player){
    let bet = {};
    let buttonData = document.getElementsByTagName("button");
    buttonData[0].addEventListener('click', getInput = () => {
        let inputField = document.getElementById('bets').value;
        bet[player] = inputField;
    });
    return bet;
}

function getPlayers() {
    let names = {};
    let player = 1;
    for (player; player <= 4; player++){
        names["Player" + player] = document.querySelector('#player'+player).dataset.name;
    }
    return names
}

function showPlayerTurn(name){
    let htmlMessage = name + "'s turn";
    let header = document.querySelector('#player-turn');
    header.textContent = htmlMessage;
}

function playCard(event) {
    let currentPlayer = document.querySelector('#player').dataset.player;
    let currentTurn = getTurn()
    let cards = JSON.parse(localStorage.getItem("cards"));
    console.log(cards);
    let currentPlayerString;
    switch (currentTurn) {
        case 1:
            currentPlayerString = '#first';
            break;
        case 2:
            currentPlayerString = '#second';
            break;
        case 3:
            currentPlayerString = '#third';
            break;
        case 4:
            currentPlayerString = '#fourth'
        }
    let turnCard = document.querySelector(currentPlayerString);
    turnCard.insertAdjacentElement('afterbegin', event.currentTarget);
    event.currentTarget.removeEventListener('click', playCard);
    let currentCard = console.log(event.currentTarget.dataset.card);
    cards[currentPlayer].splice( cards[currentPlayer].indexOf(currentCard), 1 );
    console.log(cards);

        let givenCards = document.querySelectorAll('.turn-card .card');
        for(givenCard of givenCards){
            givenCard.classList.replace('card', 'turn-card');
            givenCard.style.transform = 'rotate(0deg)';
        }
    // document.querySelector('#player').setAttribute('data-player', currentPlayer);
    nextTurn(getTurn());
    setPlayer(nextPlayerInTurn());
    displayPlayerHands(cards);
}


function checkForTrumps(trump, cardsToCheck){
    let trumpLetter = trump.split("")[0];
    let trumpMatchingCards = [];
    for (let card of cardsToCheck){
        if (card.startsWith(trumpLetter)){
            trumpMatchingCards.push(card)
        }
    }
    if (trumpMatchingCards.length === 1){
        return trumpMatchingCards[0];
    } else if (trumpMatchingCards.length > 1) {
            trumpMatchingCards.sort();
            return trumpMatchingCards[0]
    } else {
        return ""
    }
}

function compareWithFirstCard(cardsToCheck){
    let card1Letter = cardsToCheck[0].split("")[0];
    let matchingCards = [];
    for (let i = 1; i < cardsToCheck.length; i++){
        if (cardsToCheck[i].startsWith(card1Letter)){
            matchingCards.push(cardsToCheck[i])
        }
    }
    if (matchingCards.length === 1){
        return matchingCards[0]
    } else if (matchingCards.length > 1){
        matchingCards.sort();
        return matchingCards[0]
    } else {
        return ""
    }
}


//trump will be cards.trump
function checkHandRound(trump){
    let playersCards = {};
    let playerFirstInRound = document.querySelector('#firsrt').querySelector('img').dataset.player;
    let playerSecondInRound = document.querySelector('#second').querySelector('img').dataset.player;
    let playerThirdInRound = document.querySelector('#third').querySelector('img').dataset.player;
    let playerFourthInRound = document.querySelector('#fourth').querySelector('img').dataset.player;
    let card1 = document.querySelector('#first').querySelector('img').dataset.card;
    let card2 = document.querySelector('#second').querySelector('img').dataset.card;
    let card3 = document.querySelector('#third').querySelector('img').dataset.card;
    let card4 = document.querySelector('#fourth').querySelector('img').dataset.card;
    playersCards[card1] = playerFirstInRound;
    playersCards[card2] = playerSecondInRound;
    playersCards[card3] = playerThirdInRound;
    playersCards[card4] = playerFourthInRound;
    let cardsToCheck = [];
    cardsToCheck.push(card1, card2, card3, card4);
    let winnerTrumpCard = checkForTrumps(trump, cardsToCheck);
    if (winnerTrumpCard.length === 1){
        return playersCards[winnerTrumpCard]
    } else {
        let winnerCard = compareWithFirstCard(cardsToCheck);
        if (winnerCard.length === 1) {
            return playersCards[winnerCard]
        } else {
            return playersCards[card1]
        }
    }
}

//to call for a round of cards check
//checkHandRound();

//main skeleton (unfinished)
function main() {
    let round = 3;
    let cards;
    // let currentPlayer = 0;
    // let players = ['Player1', 'Player2', 'Player3', 'Player4'];
    let names = getPlayers();
    let bets = {};
    cards = dealCards(round);
    let currentPlayer = getPlayer();
    displayPlayerHands(cards);
    // bets[player] = getBets(names[player]);

}

function getPlayer() {
    return document.querySelector('#player').dataset.player;
}

function setPlayer(nextPlayerInTurn) {
   document.querySelector('#player').setAttribute('data-player', nextPlayerInTurn)
}

function nextPlayerInTurn() {
    let currentPlayer = getPlayer();
    if (currentPlayer === 'Player1') {
        return 'Player2';
    } else if (currentPlayer === 'Player2') {
        return 'Player3';
    } else if (currentPlayer === 'Player3') {
        return 'Player4';
    } else if (currentPlayer === 'Player4') {
        return 'Player1';
    }
}

function getTurn() {
    return parseInt(document.querySelector('#player').dataset.turn);
}

function nextTurn(currentTurn) {
    let newTurn;
    if (currentTurn < 4){
        newTurn = currentTurn + 1;
    } else {
        newTurn = 1;
    }
    document.querySelector('#player').setAttribute('data-turn', newTurn);
}



main();


