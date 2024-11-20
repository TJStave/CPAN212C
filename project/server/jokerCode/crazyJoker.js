const setupScoring = (joker, boardState) => {
  if(boardState.handContains.hasStraight)
    joker.onScoreAdd.push(scoring => scoring.mult += 12);
}

module.exports = { setupScoring };