const setupScoring = (joker, boardState) => {
  //this is a bit of a mess, basically the mins mean each suit only counts once,
  //but wilds as many times as they like because they're all suits at once
  //with smeared joker, black suits and red suits are what matters, so it's adjusted
  if (Math.min(boardState.numSuits.spades, 1) + Math.min(boardState.numSuits.hearts, 1)
    + Math.min(boardState.numSuits.clubs, 1) + Math.min(boardState.numSuits.diamonds, 1) + boardState.numSuits.wilds >= 4
    || (boardState.jokerMods.hasSmearedJoker && Math.min(boardState.numSuits.blacks, 2)
    + Math.min(boardState.numSuits.reds, 2) + boardState.numSuits.wilds >= 4))
    joker.onScoreMult.push(scoring => scoring.mult *= 3);
}

module.exports = { setupScoring };