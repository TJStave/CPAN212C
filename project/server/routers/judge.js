const express = require('express');
const router = express.Router();

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
//Please don't pay too much attention to this, it's not related to the implementation of the classwork and it's super messy
router.post("/", (req, res) => {
  let hasFourFingers = false;
  let hasShortcut = false;
  let hasSmearedJoker = false;
  const numSuits = {
    'wilds': 0,
    'reds': 0,
    'blacks': 0,
    'spades': 0,
    'hearts': 0,
    'clubs': 0,
    'diamonds': 0
  }
  const numRanks = {
    '2': 0,
    '3': 0,
    '4': 0,
    '5': 0,
    '6': 0,
    '7': 0,
    '8': 0,
    '9': 0,
    '10': 0,
    'Jack': 0,
    'Queen': 0,
    'King': 0,
    'Ace': 0
  };
  const handContains = {
    'hasFlush': false,
    'hasStraight': false,
    'has5oak': false,
    'has4oak': false,
    'has3oak': false,
    'has2Pair': false,
    'hasPair': false,
  }
  const hand = req.body.hand;
  const sortedHand = hand.toSorted((a, b) => {return (b.type === 'stone' ? -1 : rankOrder.indexOf(b.rank))
    - (a.type === 'stone' ? -1 : rankOrder.indexOf(a.rank))});
  for (const i in sortedHand){
    if(sortedHand[i].type === 'stone'){
      delete sortedHand[i];
    }
  }
  let numInARow = 1;
  let maxInARow = 1;
  let prevRank = null;
  for(const i in sortedHand){
    if(i != 0){
      if(rankOrder.indexOf(sortedHand[i].rank) + 1 === rankOrder.indexOf(prevRank)
        || (hasShortcut && ((rankOrder.indexOf(sortedHand[i].rank) + 2 === rankOrder.indexOf(prevRank))))){
          numInARow += 1;
          maxInARow = Math.max(numInARow, maxInARow);
      } else if(sortedHand[i].rank !== prevRank){
        numInARow = 1;
      }
    }
    prevRank = sortedHand[i].rank;
    numRanks[sortedHand[i].rank] += 1;
    if(sortedHand[i].type === 'wild'){
      numSuits.wilds += 1;
    } else if(hasSmearedJoker && (sortedHand[i].suit === 'hearts' || sortedHand[i].suit === 'diamonds')){
      numSuits.reds += 1;
    } else if(hasSmearedJoker && (sortedHand[i].suit === 'spades' || sortedHand[i].suit === 'clubs')){
      numSuits.blacks += 1;
    } else{
      numSuits[sortedHand[i].suit] += 1;
    }
  }
  if((numInARow > 1 && (sortedHand[sortedHand.length - 1].rank === '2' && sortedHand[0].rank === 'Ace')
    || (hasShortcut && sortedHand[sortedHand.length - 1].rank === '3' && sortedHand[0].rank === 'Ace'))){
      numInARow += 1;
      maxInARow = Math.max(numInARow, maxInARow);
  }
  for(const suit in numSuits){
    if(suit === 'wilds')
      continue;
    if(numSuits[suit] + numSuits.wilds >= (hasFourFingers ? 4 : 5))
      handContains.hasFlush = true;
  }
  if(maxInARow >= (hasFourFingers ? 4 : 5))
    handContains.hasStraight = true;
  for(const rank in numRanks){
    if(numRanks[rank] >= 5)
      handContains.has5oak = true;
    if(numRanks[rank] >= 4)
      handContains.has4oak = true;
    if(numRanks[rank] >= 3)
      handContains.has3oak = true;
    if(numRanks[rank] >= 2){
      if(handContains.hasPair)
        handContains.has2Pair = true;
      else
        handContains.hasPair = true;
    }
  }
  console.log(handContains);
  res.send();
});

module.exports = router;