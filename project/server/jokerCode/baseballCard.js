const setupScoring = (joker, boardState) => {
  const multMult = (scoring) => {
    scoring.mult *= 1.5;
  }
  for(let joker of boardState.jokers){
    if (joker.info.rarity === 'Uncommon'){
      joker.onScoreMult.push(multMult);
    }
  }
}

module.exports = { setupScoring };