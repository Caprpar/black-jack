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

let randInt = (min, max) => Math.floor(Math.random() * (max + 1 - min) + min);

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
    backImg: "red2.svg",
    name: `${cardName}`,
  };

  return card;
}

/**
 * Generates a deck with 52 cards
 */
function getDeck(amount = 1) {
  let suites = ["hearts", "clubs", "spades", "diamonds"];
  let values = ["ace", "2", "3", "4", "5", "6", "7", "8", "9", "10", "jack", "queen", "king"];

  let deck = [];
  while (amount !== 0) {
    for (const suite of suites) {
      for (const [cardIndex, value] of values.entries()) {
        deck.push(getCard(value, suite, cardIndex + 1));
      }
    }
    amount--;
  }
  return deck;
}

/**Returns shuffled deck from deck
 * @param {Object} deck - Deck object
 */
function shuffleDeck(deck) {
  for (let currentCard = 0; currentCard < deck.length; currentCard++) {
    let swapCard = Math.floor(Math.random() * (deck.length - 1 - currentCard + 1)) + currentCard;
    [deck[currentCard], deck[swapCard]] = [deck[swapCard], deck[currentCard]];
  }
  return deck;
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
  for (const card of hand) {
    if (!card.faceUp) break;
    card.value = card.value > 10 ? 10 : card.value; // Sets J, Q & Kings value to 10
    value += card.value === 1 ? 11 : card.value;
  }

  for (const card of hand) {
    if (!card.faceUp) break;
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
    console.log(card.name);
  }
  console.log(`Value: ${getHandValue(hand)}`);
}

// * DOM Functions
/** Set styling to card div and displays it in document
 * @param {object} card - Object */
function displayCard(card) {
  let parent = document.getElementById(card.parent);
  let newCard = document.createElement("div");

  newCard.className = "card";
  newCard.id = card.name;

  newCard.style.backgroundSize = "contain";
  newCard.style.backgroundRepeat = "no-repeat";

  newCard.style.backgroundImage = card.faceUp
    ? `url('svg_playing_cards/fronts/${card.img}')`
    : `url('svg_playing_cards/backs/red2.svg')`;
  newCard.style.top = `${card.y}px`;
  newCard.style.left = `${card.x}px`;
  newCard.style.transform = `translate(-50%, -50%) rotate(${card.rotation}deg)`;

  parent.appendChild(newCard);
}

/**
 * Gives card styling value such as coodinates and rotation
 */
function setCardPositionValues(card, x, y, rotation, parent, faceUp = true) {
  card.parent = parent;
  card.x = x;
  card.y = y;
  card.rotation = rotation;
  card.faceUp = faceUp;
}

/**
 * Toggle which side facing up
 * (replaces old div with new one)
 */
function flipCard(card) {
  card.faceUp = card.faceUp ? false : true;
  document.getElementById(card.name).remove();
  displayCard(card);
}

/** Adds card to player hand and give card positionvalues depending on which number the card is*/
function appendCardToHand(participant, deck, faceUp = true) {
  let startY = participant.parentId === "player-card-holder" ? 137 : 153;
  let startX = participant.parentId === "player-card-holder" ? 77 : 164;
  let card = drawCard(deck);
  let handLen = participant.hand.length + 1;
  let randomX = randInt(25, 26) * handLen;
  let x = startX + randomX;
  let randomY = randInt(-17, -18) * handLen;
  let y = startY + randomY;
  let randomDeg = randInt(-3, 3);
  setCardPositionValues(card, x, y, randomDeg, participant.parentId, faceUp);
  participant.hand.push(card);
  displayCard(card);
  // FIXME updateDeck(deck);
}

/** Resets each players hands and remove card elements from document */
function discardHands(...participants) {
  for (const participant of participants) {
    for (const card of participant.hand) {
      document.getElementById(card.name).remove();
    }
    participant.hand = [];
  }
  // Remove carddivs from table
  // Remove cards from hands
}

/** Go through all hands and draws them out displays them on document
 * @param {...Array} hands - array containng card objects*/
function displayHands(...hands) {
  for (const hand of hands) {
    for (const card of hand) {
      displayCard(card);
    }
  }
}

/** Deals two card each from deck, one of dealers facing down
 * @param {Array} deck - array of cards
 */
function dealStartHands(deck) {
  appendCardToHand(player, deck);
  appendCardToHand(player, deck);
  appendCardToHand(dealer, deck);
  appendCardToHand(dealer, deck, false);
}

function doOnPlayerBlackJack(playerHand, dealerHand) {
  if (getHandValue(playerHand) === 21) {
    revealDealerHand(dealerHand);
    if (getHandValue(dealerHand) !== getHandValue(playerHand)) {
      revealWinStatus(playerHand, dealerHand);
    }
  }
}

/**
 * If there are any facedown card, reveal them
 */
function revealDealerHand(hand) {
  for (let card of hand) {
    if (!card.faceUp) {
      flipCard(card);
    }
  }
}

/**Disables chosen button*/
function disableButton(button) {
  const buttonElement = document.getElementById(button.id);
  buttonElement.classList.add("inactive");
  button.active = false;
}

/**Enables chosen button*/
function enableButton(button) {
  const buttonElement = document.getElementById(button.id);
  buttonElement.classList.remove("inactive");
  button.active = true;
}

/** sets buttons back to original state */
function refreshButtons() {
  enableButton(hit);
  enableButton(stand);
  disableButton(split);
}

/**Gets winner object and decide what to display in win-status*/
function revealWinStatus(playerHand, dealerHand, reveal = true) {
  let winner = getWinner(getHandValue(playerHand), getHandValue(dealerHand));
  const gameState = {
    win: "You won!",
    lost: "You lost..",
    draw: "Push!",
    blackJack: "BLACKJACK!",
  };

  const winStatusElement = document.getElementById("win-status");
  const status = document.getElementById("status");

  if (winner.isDraw) {
    status.innerText = gameState.draw;
  } else if (winner.participant === "player") {
    if (winner.hasBlackjack) {
      status.innerText = gameState.blackJack;
    }
    status.innerText = gameState.win;
  } else if (winner.participant === "dealer") {
    status.innerText = gameState.lost;
  } else {
    status.innerText = "Error";
  }
  winStatusElement.style.visibility = reveal ? "visible" : "hidden";
}

function logHandValues() {
  console.log(`Player hand: ${getHandValue(player.hand)}`);
  console.log(`Dealer hand: ${getHandValue(dealer.hand)}`);
}

/** Compares playerhand with dealerhand and return winner object*/
function getWinner(playerHandValue, dealerHandValue) {
  const winner = { participant: "", hasBlackjack: false, isDraw: false };
  if (playerHandValue > 21) {
    winner.participant = "dealer";
  } else if (playerHandValue === dealerHandValue) {
    winner.isDraw = true;
  } else if (playerHandValue === 21) {
    winner.participant = "player";
    winner.hasBlackjack = true;
  } else if (playerHandValue > dealerHandValue) {
    winner.participant = "player";
  } else if (dealerHandValue > 21) {
    winner.participant = "player";
  } else if (playerHandValue < dealerHandValue) {
    winner.participant = "dealer";
  }
  return winner;
}

function displayDeck(deck, displayAmount = 5) {
  let deckElement = document.getElementById("deck");
  let card;

  for (let _ = 0; _ <= displayAmount; _++) {
    card = document.createElement("div");
    card.classList.add("deck-card");
    card.classList.add("card");
    card.style.top = `${randInt(-85, -75)}px`;
    card.style.left = `${randInt(0, 15)}px`;
    card.style.transform = `translate(50%, 50%) rotate(${randInt(-10, -20)}deg)`;
    deckElement.appendChild(card);
  }
}

// FIXME Im supposed to remove top card and put it to the bottom
/** create card div for each card in deck  */
function updateDeck(deck) {
  let deckElement = document.getElementById("deck");
  let topCard = deckElement.firstChild;
  console.log(topCard);
  if (deck.length > 5) {
    deckElement.append(topCard);
    deckElement.removeChild(deckElement.firstChild);
  } else {
    deckElement.removeChild(deckElement.firstChild);
  }
}

function reshuffle(deck, deckAmount) {
  return shuffleDeck(getDeck(deckAmount));
}

function addBetAmount(amountToAdd, betAmount, element) {
  betAmount += amountToAdd;
  element.textContent = `$${betAmount}`;
  return betAmount;
}

function subtractBetAmount(amountToAdd, betAmount, element) {
  betAmount -= amountToAdd;
  element.textContent = `$${betAmount}`;
  return betAmount;
}

function setBalance(amount, element) {
  element.textContent = `$${amount}`;
  return amount;
}
function setBet(amount, element) {
  element.textContent = `$${amount}`;
  return amount;
}
/**
 * @param {boolean} bool => true, false
 * @param {Array} buttons => ["hit", "stand", "split"]
 */
function isButtonsVisible(bool, buttons) {
  for (let button of buttons) {
    let currentButton = document.querySelector(`#${button}`);
    console.log(currentButton);
    currentButton.style.visibility = bool ? "visible" : "collapse";
  }
}

function hideBetWindow(element) {
  element.style.visibility = "collapse";
}
function showBetWindow(element) {
  element.style.visibility = "visible";
}

function distributeWin(winner) {
  if (winner.participant === "player") {
    balance += winner.hasBlackjack ? betAmount * 2 * 1.5 : betAmount * 2;
    setBalance(balance, balanceAmoumtElement);
  } else {
    balance -= betAmount;
    setBalance(balance, balanceAmoumtElement);
  }
}

// TODO Add Dealer bust, player bust, lost
// TODO check if deck has only one card left and reshuffle deck
// TODO add amount getDeck() so getDeck(amount) can generates mulitple decks
// TODO draw facedowncard to stack the deck and when card is drawn, remove top element
// TODO if player get blackjack on hit, reveael dealer and compare cards

// *======================= GAME STARTS ========================================

let deckAmount = 1;
let betAmount = 0;
let balance = 100;
let betStep = 10;
let betAmoumtElement = document.querySelector("#bet-amount");
let balanceAmoumtElement = document.querySelector("#balance-amount");

let betWindowElement = document.querySelector("#bet-window");
console.log(betWindowElement);

let subtractElement = document.querySelector("#subtract");
let addElement = document.querySelector("#add");

let getHandElement = document.querySelector("#get-hand");

let hitElement = document.querySelector("#hit");
let standElement = document.querySelector("#stand");
let splitElement = document.querySelector("#split");
let closeElement = document.querySelector("#close");
let newBetElement = document.querySelector("#new-bet");

setBalance(balance, balanceAmoumtElement);
setBet(betAmount, betAmoumtElement);

//* Buttons
let hit = {
  id: "hit",
  active: true,
};
let stand = {
  id: "stand",
  active: true,
};
let split = {
  id: "split",
  active: false,
};

let deck = shuffleDeck(getDeck(deckAmount));
let winner = {
  isDraw: false,
  hasBlackjack: false,
  participant: "",
};

// * Deals two card each to player and dealer
let player = {
  parentId: "player-card-holder",
  hand: [],
};
let dealer = {
  parentId: "dealer-card-holder",
  hand: [],
};
isButtonsVisible(false, ["hit", "stand", "split"]);
displayDeck(deck);
doOnPlayerBlackJack(player.hand, dealer.hand);

// *======================= Draw starthands ====================================
logHandValues();

getHandElement.addEventListener("click", () => {
  dealStartHands(deck);
  hideBetWindow(betWindowElement);
  isButtonsVisible(true, ["hit", "stand", "split"]);
  isButtonsVisible(false, ["get-hand"]);
});

// * Response to the HIT button
hitElement.addEventListener("click", () => {
  // If deck getting low, reshuffle
  deck = deck.length <= 6 ? reshuffle(deck, deckAmount) : deck;
  if (hit.active) {
    appendCardToHand(player, deck);
    logHandValues();
    if (getHandValue(player.hand) >= 21) {
      disableButton(hit);
      disableButton(stand);
      winner = getWinner(getHandValue(player.hand), getHandValue(dealer.hand));
      distributeWin(winner);
      revealWinStatus(player.hand, dealer.hand);
    }
  }
  logHandValues();
});

// * Response to the STAND button
// If deck getting low, reshuffle
deck = deck.length <= 6 ? reshuffle(deck, deckAmount) : deck;
standElement.addEventListener("click", () => {
  if (stand.active) {
    disableButton(hit);
    disableButton(stand);
    revealDealerHand(dealer.hand);
    logHandValues();
    while (getHandValue(dealer.hand) < 17) {
      appendCardToHand(dealer, deck);
    }
    winner = getWinner(getHandValue(player.hand), getHandValue(dealer.hand));
    distributeWin(winner);
    logHandValues();
    revealWinStatus(player.hand, dealer.hand);
    console.log(winner);
  }
});

// * Response to the SPLIT button
splitElement.addEventListener("click", () => {
  if (split.active) {
    console.log("Tryckte split");
  }
});

// * Response to the CLOSE button
closeElement.addEventListener("click", () => {
  document.getElementById("win-status").style.visibility = "hidden";
});

// * Response to the GET NEW BET button
newBetElement.addEventListener("click", () => {
  betAmount = setBet(0, betAmoumtElement);
  document.getElementById("win-status").style.visibility = "hidden";
  console.log("Get new hand");
  discardHands(player, dealer);
  isButtonsVisible(true, ["get-hand"]);
  isButtonsVisible(false, ["hit", "stand", "split"]);
  showBetWindow(betWindowElement);
  console.log(betAmoumtElement);
  refreshButtons();
  console.log(deck.length);
});

// * Add to bet
addElement.addEventListener("click", (event) => {
  if (balance > 0) {
    betAmount = addBetAmount(betStep, betAmount, betAmoumtElement);
    balance = setBalance(balance - betStep, balanceAmoumtElement);
  }
});

// * Subtract to bet
subtractElement.addEventListener("click", (event) => {
  console.log("subtract");
  if (betAmount > 0) {
    betAmount = subtractBetAmount(betStep, betAmount, betAmoumtElement);
    balance = setBalance(balance + betStep, balanceAmoumtElement);
  }
});
