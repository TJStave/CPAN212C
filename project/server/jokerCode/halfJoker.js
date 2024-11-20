const setupScoring = (joker, boardState) => {
  if(boardState.originHand.length <= 3)
    joker.onScoreAdd.push(scoring => scoring.mult += 20);
}

module.exports = { setupScoring };