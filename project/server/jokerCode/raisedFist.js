const rankOrder = [
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  'Jack',
  'Queen',
  'King',
  'Ace'
];

const rankScore = {
  '2': 2,
  '3': 3,
  '4': 4,
  '5': 5,
  '6': 6,
  '7': 7,
  '8': 8,
  '9': 9,
  '10': 10,
  'Jack': 10,
  'Queen': 10,
  'King': 10,
  'Ace': 11
};

const setupScoring = (joker, boardState) => {
  let sortedHand = boardState.cardsHeld.toSorted((a, b) => {return (b.type === 'stone' ? -1 : rankOrder.indexOf(b.rank))
    - (a.type === 'stone' ? -1 : rankOrder.indexOf(a.rank))});
  for (const i in sortedHand){
    if(sortedHand[i].type === 'stone'){
      sortedHand.splice(i, 1);
    }
  }
  if(sortedHand.length > 0){
    sortedHand[sortedHand.length - 1].onScoreAdd.push(scoring => scoring.mult += 2 * rankScore[sortedHand[sortedHand.length - 1].rank])
  }
}

module.exports = { setupScoring };