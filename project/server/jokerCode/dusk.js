const setupScoring = (joker, boardState) => {
  if(boardState.resources.hands == 1){
    for(let card of boardState.scoringCards)
      card.numTriggers += 1;
  }
}

module.exports = { setupScoring };