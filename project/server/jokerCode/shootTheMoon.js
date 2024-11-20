const setupScoring = (joker, boardState) => {
  for(let card of boardState.cardsHeld){
    if (card.rank === 'Queen')
      card.onScoreAdd.push(scoring => scoring.mult += 13);
  }
}

module.exports = { setupScoring };