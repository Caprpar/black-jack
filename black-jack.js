/*
 * En kortlek har 52 kort med spader, hjärter, ruter, klöver: ess-kung
 * [x] Kortleken ska blandas innan spelet börjar
 * när korten delas ut, ska ett kort dras ur leken så antal kort minskas
 *
 * En dealer och en spelare tävlar om vem som närmast når 21 poäng,
 * dealern måste dra kort om den har mindre än 16 poäng
 * Får spelaren mer än 21 förlorar den,
 * får spelaren prick 21 vinner den med 1.5 av sin insats förutsatt att dealern inte får 21
 * Är det jämnt med 17, 18, 19 vinner dealern automatiskt
 * blir det jämnt 20 eller 21 är det oavgjort och spelarens insatts ligger kvar
 *
 * 2-10 är värda sina poäng
 * knekt - kung är värda 10
 * ess är värt 1 eller 11 och anpassar sig till bästa möjliga hand
 *
 * [ ] Blandad kortlek
 * [ ] Delarens hand
 * [ ] Spelarens hand
 * [ ] Få handvärde
 * [ ] Välja om delaren ska dra ett kort eller inte
 * [ ] Val att dra ett kort elle stanna
 */

/** Generates card
 * @param {String} cardValue - card valueName "Ace", "One", "King"
 * @param {String} cardSuite - card suite "hearts", "clubs"
 * @param {Number} cardIndex - card value 1, 2, 10

 * @example
 * const card = getCard("king", "heart", 13)
 * console.log(card) // output: kingOfheart: {value: 10, suite: 'heart', img: 'spades_2.svg', name: 'king of heart', isAce: false}
*/
function getCard(cardValue, cardSuite, cardIndex) {
  let card;
  let cardName = `${cardSuite}_${cardValue}`;
  let currentCardValue = cardIndex < 11 ? cardIndex : 10; // value = 10 if card is knight, queen or king

  card = {
    value: currentCardValue,
    suite: cardSuite,
    img: `${cardName}.svg`,
    name: `${cardName}`,
  };

  return card;
}

/**
 * Generates a deck with 52 cards
 */
function getDeck() {
  let suites = ["hearts", "clubs", "spades", "diamonds"];
  let values = ["ace", "2", "3", "4", "5", "6", "7", "8", "9", "10", "jack", "queen", "king"];

  let deck = [];
  for (const suite of suites) {
    for (const [cardIndex, value] of values.entries()) {
      deck.push(getCard(value, suite, cardIndex + 1));
    }
  }
  return deck;
}

/**Returns shuffled deck from deck
 * @param {Object} deck - Deck object
 */
function shuffleDeck(deck) {
  let shuffled = [];
  while (deck.length !== 0) {
    let randomCardIdx = Math.floor(Math.random() * deck.length);
    let randomCard = deck.splice(randomCardIdx, 1);
    shuffled.push(randomCard);
  }
  return shuffled;
}

/** Returns top card from deck */
function drawCard(deck) {
  return deck.pop();
}

/** Add card to hand*/
function addToHand(hand, card) {
  hand.push(card);
}

/** Get value from current hand */
function getHandValue(hand) {
  let value = 0;
  // Change jack, queen and king value to 10 and push to handArray
  for (const currentCard of hand) {
    let card = currentCard[0];
    card.value = card.value > 10 ? 10 : card.value; // Sets J, Q & Kings value to 10
    value += card.value === 1 ? 11 : card.value;
  }

  for (const currentCard of hand) {
    let card = currentCard[0];
    value -= card.value === 1 && value > 21 ? 10 : 0;
  }
  return value;
}

function displayBoard() {
  console.log("=========================");
  console.log("Player");
  logHand(player.hand);
  console.log("Dealer");
  logHand(dealer.hand);
}

/**Format and log the cards that are in the hand
 *
 */
function logHand(hand) {
  for (const card of hand) {
    console.log(card[0].name);
  }
  console.log(`Value: ${getHandValue(hand)}`);
}

// * DOM Functions
function displayCard(parentTag, card, positionX, positionY, rotation) {
  let parent = document.getElementById(parentTag);
  let newCard = document.createElement("div");
  card = card[0];

  newCard.className = "card";
  newCard.id = card.name;

  newCard.style.backgroundSize = "contain";
  newCard.style.backgroundRepeat = "no-repeat";

  newCard.style.backgroundImage = `url('/svg_playing_cards/fronts/${card.img}')`;
  newCard.style.top = `${positionX}%`;
  newCard.style.left = `${positionY}%`;
  newCard.style.transform = `translate(-50%, -50%) rotate(${rotation}deg)`;

  parent.appendChild(newCard);
  /*
    background-image: url("/svg_playing_cards/fronts/clubs_2.svg");
  top: 52%;
  left: 45%;
  transform: translate(-50%, -50%) rotate(3deg);
   */
}

// *======================= GAME STARTS ========================================
// console.log(getCard("ace", "heart"));
let deck = shuffleDeck(getDeck());
let game = false;
let playerDrawsCard = false;

// * Deals two card each to player and dealer
let player = {
  hand: [drawCard(deck), drawCard(deck)],
};

displayCard("player-card-holder", player.hand[0], 52, 45, 3);
displayCard("player-card-holder", player.hand[1], 44, 59, -3);

let dealer = {
  hand: [drawCard(deck), drawCard(deck)],
};

while (game) {
  // Display dealer score
  displayBoard();

  // Player choose to draw card if hand not blackjack
  if (getHandValue(player.hand) !== 21) {
    // * Vill spelaren dra ett till kort?
    playerDrawsCard = prompt("Dra kort? (y/n)") === "y" ? true : false;
  }

  if (playerDrawsCard) {
    player.hand.push(drawCard(deck));

    if (getHandValue(player.hand) > 21) {
      break;
    }
  } else {
    // När spelaren tackar nej till kort, drar dealern upp kort medans värdet är < 16
    while (getHandValue(dealer.hand) < 16) {
      dealer.hand.push(drawCard(deck));
    }
  }
  // Om spelaren drar kort ska dealern oxå dra kort om dealers hand är < 16
  if (getHandValue(dealer.hand) < 16) {
    dealer.hand.push(drawCard(deck));
  } else {
    break;
  }

  // * Dealer drar kort om totala värde < 16
  // Display player score
  // Spelare och dealer drar två kort var
  // Spelare väljer om den vill dra ett nytt kort
  // Delaer drar ett kort om dens poäng är under 16
  // game = false;
}

displayBoard();

console.log(`Player value = ${getHandValue(player.hand)}`);
console.log(`Dealer value = ${getHandValue(dealer.hand)}`);

let playerHand = getHandValue(player.hand);
let dealerHand = getHandValue(dealer.hand);

if (playerHand > 21) {
  console.log("lost");
} else if (dealerHand > 21 || dealerHand < playerHand) {
  console.log("win");
} else if (playerHand === dealerHand && playerHand < 20) {
  console.log("lost");
} else if (playerHand === dealerHand && playerHand > 19) {
  console.log("tie");
} else if (playerHand === 21) {
  console.log("BLACKJACK WIN!");
} else {
  console.log("Player hand | Dealer hand");
  console.log(`${playerHand} > ${dealerHand} | ${playerHand > dealerHand}`);
  console.log(`${playerHand} < ${dealerHand} | ${playerHand < dealerHand}`);
  console.log(`${playerHand} === ${dealerHand} | ${playerHand === dealerHand}`);
}
