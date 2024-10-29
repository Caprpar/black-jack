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
 * console.log(card) // output: kingOfheart: {value: 10, suite: 'heart', img: 'kingOfheart.png', name: 'king of heart', isAce: false}
*/
function getCard(cardValue, cardSuite, cardIndex) {
  let card;
  let cardName = `${cardValue}Of${cardSuite}`;
  let currentCardValue = cardIndex < 11 ? cardIndex : 10; // value = 10 if card is knight, queen or king

  card = {
    value: currentCardValue,
    suite: cardSuite,
    img: `${cardName}.png`,
    name: `${cardValue} of ${cardSuite}`,
  };

  return card;
}

/**
 * Generates a deck with 52 cards
 */
function getDeck() {
  let suites = ["hearth", "club", "spade", "diamond"];
  let values = [
    "ace",
    "two",
    "three",
    "four",
    "five",
    "six",
    "seven",
    "eight",
    "nine",
    "ten",
    "knight",
    "queen",
    "king",
  ];

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
  // Addera alla kortens värden
  // om något av korten är ess, kolla om totala värdet + 11 > 21, ge då ess värdet 1
  let value = 0;
  for (const currentCard of hand) {
    card = currentCard[0];
    value += card.value === 1 && value + 11 === 21 ? 11 : card.value;
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

// *======================= GAME STARTS ========================================
// console.log(getCard("ace", "heart"));
let deck = shuffleDeck(getDeck());
let game = true;
let playerDrawsCard = false;

// * Deals two card each to player and dealer
let player = {
  hand: [drawCard(deck), drawCard(deck)],
};

let dealer = {
  hand: [drawCard(deck), drawCard(deck)],
};

while (game) {
  // Display dealer score
  displayBoard();
  // TODO Automatiskt skippar frågan om dra kort ifall spelare får blackjack

  // * Vill spelaren dra ett till kort?
  playerDrawsCard = prompt("Dra kort? (y/n)") === "y" ? true : false;

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

/*
 * if player lost player bet -= bet
 * if dealer lost player keeps bet
 * if tie below 19 player bet-=bet
 * if tie above 19 player keeps bet
 * if player blackjack and win bet += bet * 1.5
 * if player win bet += bet
 */
