const setupScoring = (joker, boardState) => {
  if(boardState.handContains.hasFlush)
    joker.onScoreAdd.push(scoring => scoring.chips += 80);
}

module.exports = { setupScoring };