const setupScoring = (joker, boardState) => {
  if(boardState.handContains.hasStraight)
    joker.onScoreAdd.push(scoring => scoring.chips += 100);
}

module.exports = { setupScoring };