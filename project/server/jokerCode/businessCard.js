const setupScoring = (joker, boardState) => {
  for(let card of boardState.scoringCards){
    if (card.rank === 'King' || card.rank === 'Queen' || card.rank === 'Jack' || boardState.jokerMods.hasPareidolia){
      card.onScoreOther.push((boardState) => {if(Math.random() * 2 <=  boardState.chanceMult){boardState.resources.money += 2}});
    }
  }
}

module.exports = { setupScoring };