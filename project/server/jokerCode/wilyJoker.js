const setupScoring = (joker, boardState) => {
  if(boardState.handContains.has3oak)
    joker.onScoreAdd.push(scoring => scoring.chips += 100);
}

module.exports = { setupScoring };