const setupScoring = (joker, boardState) => {
  for(let card of boardState.scoringCards){
    if (card.rank === '2' || card.rank === '3' || card.rank === '4' || card.rank === '5'){
      card.numTriggers += 1;
    }
  }
}

module.exports = { setupScoring };