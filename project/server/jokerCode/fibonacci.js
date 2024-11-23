const setupScoring = (joker, boardState) => {
  for(let card of boardState.scoringCards){
    if (card.rank === 'Ace' || card.rank === '2' || card.rank === '3' || card.rank === '5' || card.rank === '8'){
      card.onScoreAdd.push(scoring => scoring.mult += 8);
    }
  }
}

module.exports = { setupScoring };