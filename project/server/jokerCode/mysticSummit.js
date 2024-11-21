const setupScoring = (joker, boardState) => {
  if(boardState.resources.discards == 0)
    joker.onScoreAdd.push(scoring => scoring.mult += 15);
}

module.exports = { setupScoring };