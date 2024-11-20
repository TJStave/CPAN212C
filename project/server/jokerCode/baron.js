const setupScoring = (joker, boardState) => {
  for(let card of boardState.cardsHeld){
    if (card.rank === 'King')
      card.onScoreMult.push(scoring => scoring.mult *= 1.5);
  }
}

module.exports = { setupScoring };