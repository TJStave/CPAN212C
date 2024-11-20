const setupScoring = (joker, boardState) => {
  if(boardState.handContains.has2Pair)
    joker.onScoreAdd.push(scoring => scoring.mult += 10);
}

module.exports = { setupScoring };