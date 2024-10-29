/*
 * En kortlek har 52 kort med spader, hjärter, ruter, klöver: ess-kung
 * Kortleken ska blandas innan spelet börjar
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
 */
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
