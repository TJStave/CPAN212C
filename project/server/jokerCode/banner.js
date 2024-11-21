const setupScoring = (joker, boardState) => {
  joker.onScoreAdd.push(scoring => scoring.chips += boardState.resources.discards * 30);
}

module.exports = { setupScoring };