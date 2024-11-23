const setupScoring = (joker, boardState) => {
  if(boardState.handContains.has3oak)
    joker.onScoreMult.push(scoring => scoring.mult *= 3);
}

module.exports = { setupScoring };