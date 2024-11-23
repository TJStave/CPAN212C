const setupScoring = (joker, boardState) => {
  //this is a bit of a mess, the clubs min means only 1 club counts, and the max means that as long as any suit is present it works
  //but wilds count as many times as they like because they're all suits at once
  //with smeared joker, black suits and red suits are what matters, so it's adjusted
  if (Math.min(boardState.numSuits.clubs, 1)
    + Math.min(Math.max(boardState.numSuits.spades, boardState.numSuits.hearts, boardState.numSuits.diamonds), 1)
    + boardState.numSuits.wilds >= 2
    || (boardState.jokerMods.hasSmearedJoker && Math.min(boardState.numSuits.blacks, 2)
    + Math.min(boardState.numSuits.reds, 1) + boardState.numSuits.wilds >= 2))
    joker.onScoreMult.push(scoring => scoring.mult *= 2);
}

module.exports = { setupScoring };