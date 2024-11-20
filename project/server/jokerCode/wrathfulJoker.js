const setupScoring = (joker, boardState) => {
  for(let card of boardState.scoringCards){
    if (card.suit === 'spades' || card.type === 'wild' || (boardState.jokerMods.hasSmearedJoker && card.suit === 'clubs'))
      card.onScoreAdd.push(scoring => scoring.mult += 4);
  }
}

module.exports = { setupScoring };