const setupScoring = (joker, boardState) => {
  for(let joker of boardState.jokers){
    if (joker.info.rarity === 'Uncommon')
      joker.onScoreMult.push(scoring => scoring.mult *= 1.5);
  }
}

module.exports = { setupScoring };