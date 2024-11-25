const setupScoring = (joker, boardState) => {
  if(boardState.resources.hands == 1)
    joker.onScoreMult.push(scoring => scoring.mult *= 3);
}

module.exports = { setupScoring };