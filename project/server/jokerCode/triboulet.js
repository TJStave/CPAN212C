const setupScoring = (joker, boardState) => {
  for(let card of boardState.scoringCards){
    if (card.rank === 'King' || card.rank === 'Queen')
      card.onScoreMult.push(scoring => scoring.mult *= 2);
  }
}

module.exports = { setupScoring };