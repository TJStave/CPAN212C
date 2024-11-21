const setupScoring = (joker, boardState) => {
  joker.onScoreAdd.push(scoring => scoring.mult += Math.floor(Math.random() * 24));
}

module.exports = { setupScoring };