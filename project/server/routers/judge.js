const express = require('express');
const router = express.Router();
const uniq = require('lodash/uniq');

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
  const jokerMods = {
    'hasFourFingers': false,
    'hasShortcut': false,
    'hasSmearedJoker': false,
    'hasSplash': false,
    'hasPareidolia': false
  }
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
  const handKeys = {
    'keysFlush': [],
    'keysStraight': [],
    'keys5oak': [],
    'keys4oak': [],
    'keys3oak': [],
    'keys2Pair': [],
    'keysPair': [],
    'keyHighCard': []
  }

  const hand = req.body.hand;
  let sortedHand = hand.toSorted((a, b) => {return (b.type === 'stone' ? -1 : rankOrder.indexOf(b.rank))
    - (a.type === 'stone' ? -1 : rankOrder.indexOf(a.rank))});
  for (const i in sortedHand){
    if(sortedHand[i].type === 'stone'){
      delete sortedHand[i];
    }
  }
  if (sortedHand.length !== 0){
    handKeys.keyHighCard[0] = sortedHand[0].key;

    let numInARow = 1;
    let maxInARow = numInARow;
    let prevRank = null;
    let tempStraightKeys = [sortedHand[0].key];
    let maxStraightKeys = tempStraightKeys;
    for(const i in sortedHand){
      //This mess of code identifies straights
      if(i != 0){
        if(rankOrder.indexOf(sortedHand[i].rank) + 1 === rankOrder.indexOf(prevRank)
          || (jokerMods.hasShortcut && ((rankOrder.indexOf(sortedHand[i].rank) + 2 === rankOrder.indexOf(prevRank))))){
            numInARow += 1;
            tempStraightKeys[tempStraightKeys.length] = sortedHand[i].key;
            maxInARow = Math.max(numInARow, maxInARow);
            if(tempStraightKeys.length > maxStraightKeys.length)
              maxStraightKeys = tempStraightKeys;
        } else if(sortedHand[i].rank !== prevRank){
          numInARow = 1;
          tempStraightKeys = [sortedHand[i].key];
        }
      }
      prevRank = sortedHand[i].rank;
      //count the number of card in each ranks to identify pairs and num of a kind
      numRanks[sortedHand[i].rank] += 1;
      //count the number of cards in each suit to identify flushes
      if(sortedHand[i].type === 'wild'){
        numSuits.wilds += 1;
      } else if(jokerMods.hasSmearedJoker && (sortedHand[i].suit === 'hearts' || sortedHand[i].suit === 'diamonds')){
        numSuits.reds += 1;
      } else if(jokerMods.hasSmearedJoker && (sortedHand[i].suit === 'spades' || sortedHand[i].suit === 'clubs')){
        numSuits.blacks += 1;
      } else{
        numSuits[sortedHand[i].suit] += 1;
      }
    }
    //This code is for the edge case of Aces in low straights, since an Ace can also count as a 1
    if((numInARow > 1 && (sortedHand[sortedHand.length - 1].rank === '2' && sortedHand[0].rank === 'Ace')
      || (jokerMods.hasShortcut && sortedHand[sortedHand.length - 1].rank === '3' && sortedHand[0].rank === 'Ace'))){
        numInARow += 1;
        tempStraightKeys[tempStraightKeys.length] = sortedHand[0].key;
        maxInARow = Math.max(numInARow, maxInARow);
        if(tempStraightKeys.length > maxStraightKeys.length)
          maxStraightKeys = tempStraightKeys;
    }
    //flush identification code
    for(const suit in numSuits){
      if(suit === 'wilds')
        continue;
      if(numSuits[suit] + numSuits.wilds >= (jokerMods.hasFourFingers ? 4 : 5)){
        handContains.hasFlush = true;
        for(const i in sortedHand){
          if(sortedHand[i].type === 'wild'){
            handKeys.keysFlush[handKeys.keysFlush.length] = sortedHand[i].key;
          } else if(jokerMods.hasSmearedJoker && suit === 'reds' && (sortedHand[i].suit === 'hearts' || sortedHand[i].suit === 'diamonds')){
            handKeys.keysFlush[handKeys.keysFlush.length] = sortedHand[i].key;
          } else if(jokerMods.hasSmearedJoker && suit === 'blacks' && (sortedHand[i].suit === 'spades' || sortedHand[i].suit === 'clubs')){
            handKeys.keysFlush[handKeys.keysFlush.length] = sortedHand[i].key;
          } else if(sortedHand[i].suit === suit){
            handKeys.keysFlush[handKeys.keysFlush.length] = sortedHand[i].key;
          }
        }
      }
    }
    if(maxInARow >= (jokerMods.hasFourFingers ? 4 : 5)){
      handContains.hasStraight = true;
      handKeys.keysStraight = maxStraightKeys;
    }
    for(const rank in numRanks){
      if(numRanks[rank] >= 5){
        handContains.has5oak = true;
        for(const i in sortedHand){
          if(sortedHand[i].rank === rank){
            handKeys.keys5oak[handKeys.keys5oak.length] = sortedHand[i].key;
          }
        }
      }
      if(numRanks[rank] >= 4){
        handContains.has4oak = true;
        for(const i in sortedHand){
          if(sortedHand[i].rank === rank){
            handKeys.keys4oak[handKeys.keys4oak.length] = sortedHand[i].key;
          }
        }
      }
      if(numRanks[rank] >= 3){
        handContains.has3oak = true;
        for(const i in sortedHand){
          if(sortedHand[i].rank === rank){
            handKeys.keys3oak[handKeys.keys3oak.length] = sortedHand[i].key;
          }
        }
      }
      if(numRanks[rank] >= 2){
        if(handContains.hasPair){
          handContains.has2Pair = true;
          handKeys.keys2Pair = handKeys.keysPair;
          for(const i in sortedHand){
            if(sortedHand[i].rank === rank){
              handKeys.keys2Pair[handKeys.keys2Pair.length] = sortedHand[i].key;
            }
          }
        } else{
          handContains.hasPair = true;
          for(const i in sortedHand){
            if(sortedHand[i].rank === rank){
              handKeys.keysPair[handKeys.keysPair.length] = sortedHand[i].key;
            }
          }
        }
      }
    }
  }
  const pokerHands = [
    {'ref': 'flushFive', 'name': 'Flush Five', 'qualifies': handContains.hasFlush && handContains.has5oak, 'scoringKeys': uniq(handKeys.keysFlush.concat(handKeys.keys5oak))},
    {'ref': 'flushHouse', 'name': 'Flush House', 'qualifies': handContains.hasFlush && handContains.has3oak && handContains.has2Pair, 'scoringKeys': uniq(handKeys.keysFlush.concat(handKeys.keys3oak, handKeys.keys2Pair))},
    {'ref': 'fiveOfAKind', 'name': 'Five of a Kind', 'qualifies': handContains.has5oak, 'scoringKeys': uniq(handKeys.keys5oak)},
    {'ref': 'straightFlush', 'name': 'Straight Flush', 'qualifies': handContains.hasStraight && handContains.hasFlush, 'scoringKeys': uniq(handKeys.keysStraight.concat(handKeys.keysFlush))},
    {'ref': 'fourOfAKind', 'name': 'Four of a Kind', 'qualifies': handContains.has4oak, 'scoringKeys': uniq(handKeys.keys4oak)},
    {'ref': 'fullHouse', 'name': 'Full House', 'qualifies': handContains.has3oak && handContains.has2Pair, 'scoringKeys': uniq(handKeys.keys3oak.concat(handKeys.keys2Pair))},
    {'ref': 'flush', 'name': 'Flush', 'qualifies': handContains.hasFlush, 'scoringKeys': uniq(handKeys.keysFlush)},
    {'ref': 'straight', 'name': 'Straight', 'qualifies': handContains.hasStraight, 'scoringKeys': uniq(handKeys.keysStraight)},
    {'ref': 'threeOfAKind', 'name': 'Three of a Kind', 'qualifies': handContains.has3oak, 'scoringKeys': uniq(handKeys.keys3oak)},
    {'ref': 'twoPair', 'name': 'Two Pair', 'qualifies': handContains.has2Pair, 'scoringKeys': uniq(handKeys.keys2Pair)},
    {'ref': 'pair', 'name': 'Pair', 'qualifies': handContains.hasPair, 'scoringKeys': uniq(handKeys.keysPair)},
    {'ref': 'highCard', 'name': 'High Card', 'qualifies': true, 'scoringKeys': handKeys.keyHighCard},
  ]
  const scoringKeys = [];
  let handName;
  for (let handType of pokerHands){
    if (handType.qualifies){
      handName = handType.name;
      scoringKeys = handType.scoringKeys;
      break;
    }
  }
  for (let i in hand){
    if(hand[i].type === 'stone');
    scoringKeys[scoringKeys.length] = hand[i].key;
  }
  console.log(handContains);
  res.send();
});

module.exports = router;