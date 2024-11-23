const setupScoring = (joker, boardState) => {
  if(boardState.handContains.hasPair)
    joker.onScoreMult.push(scoring => scoring.mult *= 2);
}

module.exports = { setupScoring };