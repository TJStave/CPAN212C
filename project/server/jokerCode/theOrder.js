const setupScoring = (joker, boardState) => {
  if(boardState.handContains.hasStraight)
    joker.onScoreMult.push(scoring => scoring.mult *= 3);
}

module.exports = { setupScoring };