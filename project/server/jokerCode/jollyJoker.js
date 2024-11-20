const setupScoring = (joker, boardState) => {
  if(boardState.handContains.hasPair)
    joker.onScoreAdd.push(scoring => scoring.mult += 8);
}

module.exports = { setupScoring };