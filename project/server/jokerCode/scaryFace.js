const setupScoring = (joker, boardState) => {
  for(let card of boardState.scoringCards){
    if (card.rank === 'King' || card.rank === 'Queen' || card.rank === 'Jack' || boardState.jokerMods.hasPareidolia){
      card.onScoreAdd.push(scoring => scoring.chips += 30);
    }
  }
}

module.exports = { setupScoring };