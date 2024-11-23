const setupScoring = (joker, boardState) => {
  for(let card of boardState.scoringCards){
    if (card.rank === 'King' || card.rank === 'Queen' || card.rank === 'Jack' || boardState.jokerMods.hasPareidolia){
      card.numTriggers += 1;
    }
  }
}

module.exports = { setupScoring };