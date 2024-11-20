const setupScoring = (joker, boardState) => {
  joker.onScoreAdd.push(scoring => scoring.mult += 4);
}

module.exports = { setupScoring };