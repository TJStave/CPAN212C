const setupScoring = (joker, boardState) => {
  for(let card of boardState.cardsHeld)
    card.numTriggers += 1;
}

module.exports = { setupScoring };