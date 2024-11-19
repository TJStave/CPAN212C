const setupScoring = (joker, boardState) => {
  const addMult = (scoring) => {
    scoring.mult += 4;
  }
  joker.onScoreAdd.push(addMult);
}

module.exports = { setupScoring };