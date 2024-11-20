const nothingBurger = () => {
  return undefined;
}

const rankFunctions = {
  '2': card => card.onScoreAdd.push((scoring) => scoring.chips += 2),
  '3': card => card.onScoreAdd.push((scoring) => scoring.chips += 3),
  '4': card => card.onScoreAdd.push((scoring) => scoring.chips += 4),
  '5': card => card.onScoreAdd.push((scoring) => scoring.chips += 5),
  '6': card => card.onScoreAdd.push((scoring) => scoring.chips += 6),
  '7': card => card.onScoreAdd.push((scoring) => scoring.chips += 7),
  '8': card => card.onScoreAdd.push((scoring) => scoring.chips += 8),
  '9': card => card.onScoreAdd.push((scoring) => scoring.chips += 9),
  '10': card => card.onScoreAdd.push((scoring) => scoring.chips += 10),
  'Jack': card => card.onScoreAdd.push((scoring) => scoring.chips += 10),
  'Queen': card => card.onScoreAdd.push((scoring) => scoring.chips += 10),
  'King': card => card.onScoreAdd.push((scoring) => scoring.chips += 10),
  'Ace': card => card.onScoreAdd.push((scoring) => scoring.chips += 11)
};

const scoredCardTypes = {
  'normal': nothingBurger,
  'bonus': card => card.onScoreAdd.push((scoring) => scoring.chips += 30),
  'mult': card => card.onScoreAdd.push((scoring) => scoring.mult += 4),
  'wild': nothingBurger,
  'glass': card => card.onScoreMult.push((scoring) => scoring.mult *= 2),
  'steel': nothingBurger,
  'stone': card => card.onScoreAdd.push((scoring) => scoring.chips += 50),
  'gold': nothingBurger,
  'lucky': card => {
    rand1 = Math.random() * 5;
    rand2 = Math.random() * 15;
    if (rand1 <= 1)
      card.onScoreAdd.push((scoring) => scoring.mult += 20);
    if (rand2 <= 1)
      card.onScoreOther.push((boardState) => boardState.resources.money += 20);
  }
};

const heldCardTypes = {
  'normal': nothingBurger,
  'bonus': nothingBurger,
  'mult': nothingBurger,
  'wild': nothingBurger,
  'glass': nothingBurger,
  'steel': card => card.onScoreMult.push((scoring) => scoring.mult *= 1.5),
  'stone': nothingBurger,
  'gold': nothingBurger,
  'lucky': nothingBurger
};

const scoredSeals = {
  'gold': card => card.onScoreOther.push((boardState) => boardState.resources.money += 3),
  'red': card => card.numTriggers += 1,
  'blue': nothingBurger,
  'purple': nothingBurger
};

const heldSeals = {
  'gold': nothingBurger,
  'red': card => card.numTriggers += 1,
  'blue': nothingBurger,
  'purple': nothingBurger
};

module.exports = { rankFunctions, scoredCardTypes, heldCardTypes, scoredSeals, heldSeals };