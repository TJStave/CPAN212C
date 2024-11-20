const setupScoring = (joker, boardState) => {
  if(boardState.handContains.hasPair)
    joker.onScoreAdd.push(scoring => scoring.chips += 50);
}

module.exports = { setupScoring };