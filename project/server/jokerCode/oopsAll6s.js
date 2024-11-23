const chanceTime = (boardState) => {
  boardState.chanceMult *= 2;
}

module.exports = { chanceTime };