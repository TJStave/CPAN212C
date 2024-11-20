const setupScoring = (joker, boardState) => {
  if(boardState.handContains.has3oak)
    joker.onScoreAdd.push(scoring => scoring.mult += 12);
}

module.exports = { setupScoring };