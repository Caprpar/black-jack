function getCard(cardValue, cardSuite, cardIndex) {
  let card = [];
  let cardName = `${cardValue}Of${cardSuite}`;
  let isCardAce = cardValue === "ace" ? true : false;
  let currentCardValue = isCardAce ? [1, 11] : cardIndex + 1;

  card[`${cardName}`] = {
    value: currentCardValue,
    suite: cardSuite,
    img: `${cardName}.png`,
    name: `${cardValue} of ${cardSuite}`,
    isAce: isCardAce,
  };

  return card;
}

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
      deck.push(getCard(value, suite, cardIndex));
    }
  }
  return deck;
}

// console.log(getCard("ace", "heart"));
let deck = getDeck();
console.log(deck);
