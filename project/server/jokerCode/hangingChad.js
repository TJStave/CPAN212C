const setupScoring = (joker, boardState) => {
  boardState.scoringCards[0].numTriggers += 2;
}

module.exports = { setupScoring };