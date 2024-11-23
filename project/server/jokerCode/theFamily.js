const setupScoring = (joker, boardState) => {
  if(boardState.handContains.has4oak)
    joker.onScoreMult.push(scoring => scoring.mult *= 4);
}

module.exports = { setupScoring };