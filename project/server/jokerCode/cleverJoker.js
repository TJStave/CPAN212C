const setupScoring = (joker, boardState) => {
  if(boardState.handContains.has2Pair)
    joker.onScoreAdd.push(scoring => scoring.chips += 80);
}

module.exports = { setupScoring };