const setupScoring = (joker, boardState) => {
  if(boardState.handContains.hasFlush)
    joker.onScoreAdd.push(scoring => scoring.mult += 10);
}

module.exports = { setupScoring };