const express = require('express');
const router = express.Router();
const uniq = require('lodash/uniq');
const { rankFunctions, scoredCardTypes, heldCardTypes, scoredSeals, heldSeals } = require('../cardCode/cardSetup')

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
//Please don't pay too much attention to this, it's not related to the implementation of the database or basic server stuff and it's super messy
//Honestly I don't expect anyone else to understand all this
router.post("/", (req, res) => {
  //array for storing booleans regarding jokers with meta effects
  const jokerMods = {
    'hasFourFingers': false, //Four fingers makes flushes and straights only require 4 cards
    'hasShortcut': false, //Shortcut allows straights to skip a rank in between cards
    'hasSmearedJoker': false, //Smeared joker makes suits count as if they were both suits of their colour
    'hasSplash': false, //Splash makes all played cards score, instead of just cards that make up the hand type
    'hasPareidolia': false //Pareidolia makes all cards count as face cards
  }
  //counts the number of cards that are part of each suit, mainly used for detecting flushes, but some jokers use it
  const numSuits = {
    'wilds': 0,
    'reds': 0,
    'blacks': 0,
    'spades': 0,
    'hearts': 0,
    'clubs': 0,
    'diamonds': 0
  }
  //counts the number of cards that are each rank, used for detecting pairs + num of a kind
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
  //variables used to determine what hand type has been played, some jokers additionally activate depending on these variables
  const handContains = {
    'hasFlush': false,
    'hasStraight': false,
    'has5oak': false,
    'has4oak': false,
    'has3oak': false,
    'has2Pair': false,
    'hasPair': false,
  }
  //the arrays contain info on what cards are part of each hand type
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
  //info on hand types including base score
  const pokerHands = {
    'flushFive': {'name': 'Flush Five', 'baseScore': {'chips': 160, 'mult': 16}, 'scaling': {'chips': 50, 'mult': 3}},
    'flushHouse': {'name': 'Flush House', 'baseScore': {'chips': 140, 'mult': 14}, 'scaling': {'chips': 40, 'mult': 4}},
    'fiveOfAKind': {'name': 'Five of a Kind', 'baseScore': {'chips': 120, 'mult': 12}, 'scaling': {'chips': 35, 'mult': 3}},
    'straightFlush': {'name': 'Straight Flush', 'baseScore': {'chips': 100, 'mult': 8}, 'scaling': {'chips': 40, 'mult': 4}},
    'fourOfAKind': {'name': 'Four of a Kind', 'baseScore': {'chips': 60, 'mult': 7}, 'scaling': {'chips': 30, 'mult': 3}},
    'fullHouse': {'name': 'Full House', 'baseScore': {'chips': 40, 'mult': 4}, 'scaling': {'chips': 25, 'mult': 2}},
    'flush': {'name': 'Flush', 'baseScore': {'chips': 35, 'mult': 4}, 'scaling': {'chips': 15, 'mult': 2}},
    'straight': {'name': 'Straight', 'baseScore': {'chips': 30, 'mult': 4}, 'scaling': {'chips': 30, 'mult': 3}},
    'threeOfAKind': {'name': 'Three of a Kind', 'baseScore': {'chips': 30, 'mult': 3}, 'scaling': {'chips': 20, 'mult': 2}},
    'twoPair': {'name': 'Two Pair', 'baseScore': {'chips': 20, 'mult': 2}, 'scaling': {'chips': 20, 'mult': 1}},
    'pair': {'name': 'Pair', 'baseScore': {'chips': 10, 'mult': 2}, 'scaling': {'chips': 15, 'mult': 1}},
    'highCard': {'name': 'High Card', 'baseScore': {'chips': 5, 'mult': 1}, 'scaling': {'chips': 10, 'mult': 1}},
  }

  const jokers = req.body.jokers;
  const hand = req.body.hand;
  const cards = req.body.cards;
  const resources = req.body.resources;

  //loading code for each joker
  for(let i in jokers){
    try {
      let jokerModule = require('../jokerCode/' + jokers[i].joker + '.js');
      jokers[i].code = jokerModule;
    } catch (error) {}
  }

  //set up jokers with meta effects
  for (let i in jokers){
    if (jokers[i].code && jokers[i].code.setModifier instanceof Function){
      jokers[i].code.setModifier(jokerMods);
    }
  }

  //sort hand to identify straights
  let sortedHand = hand.toSorted((a, b) => {return (b.type === 'stone' ? -1 : rankOrder.indexOf(b.rank))
    - (a.type === 'stone' ? -1 : rankOrder.indexOf(a.rank))});
  for (const i in sortedHand){
    if(sortedHand[i].type === 'stone'){
      sortedHand.splice(i, 1);
    }
  }
  //if there are only stone cards in hand, skip all this
  if (sortedHand.length > 0){
    //set high card
    handKeys.keyHighCard[0] = sortedHand[0].key;

    //This mess of code identifies straights
    let numInARow = 1;
    let maxInARow = numInARow;
    let prevRank = null;
    let tempStraightKeys = [sortedHand[0].key];
    let maxStraightKeys = tempStraightKeys;
    for(const i in sortedHand){
      if(i != 0){
        if(rankOrder.indexOf(sortedHand[i].rank) + 1 === rankOrder.indexOf(prevRank)
          || (jokerMods.hasShortcut && ((rankOrder.indexOf(sortedHand[i].rank) + 2 === rankOrder.indexOf(prevRank))))){
            numInARow += 1;
            tempStraightKeys.push(sortedHand[i].key);
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
        tempStraightKeys.push(sortedHand[0].key);
        maxInARow = Math.max(numInARow, maxInARow);
        if(tempStraightKeys.length > maxStraightKeys.length)
          maxStraightKeys = tempStraightKeys;
    }
    //determines if there are enough cards in a row for a straight
    if(maxInARow >= (jokerMods.hasFourFingers ? 4 : 5)){
      handContains.hasStraight = true;
      handKeys.keysStraight = maxStraightKeys;
    }
    //flush identification code
    for(const suit in numSuits){
      if(suit === 'wilds')
        continue;
      if(numSuits[suit] + numSuits.wilds >= (jokerMods.hasFourFingers ? 4 : 5)){
        handContains.hasFlush = true;
        for(const i in sortedHand){
          if(sortedHand[i].type === 'wild'){
            handKeys.keysFlush.push(sortedHand[i].key);
          } else if(jokerMods.hasSmearedJoker && suit === 'reds' && (sortedHand[i].suit === 'hearts' || sortedHand[i].suit === 'diamonds')){
            handKeys.keysFlush.push(sortedHand[i].key);
          } else if(jokerMods.hasSmearedJoker && suit === 'blacks' && (sortedHand[i].suit === 'spades' || sortedHand[i].suit === 'clubs')){
            handKeys.keysFlush.push(sortedHand[i].key);
          } else if(sortedHand[i].suit === suit){
            handKeys.keysFlush.push(sortedHand[i].key);
          }
        }
      }
    }
    //the if statements identify pairs and num of a kind
    for(const rank in numRanks){
      if(numRanks[rank] >= 5){
        handContains.has5oak = true;
        for(const i in sortedHand){
          if(sortedHand[i].rank === rank){
            handKeys.keys5oak.push(sortedHand[i].key);
          }
        }
      }
      if(numRanks[rank] >= 4){
        handContains.has4oak = true;
        for(const i in sortedHand){
          if(sortedHand[i].rank === rank){
            handKeys.keys4oak.push(sortedHand[i].key);
          }
        }
      }
      if(numRanks[rank] >= 3){
        handContains.has3oak = true;
        for(const i in sortedHand){
          if(sortedHand[i].rank === rank){
            handKeys.keys3oak.push(sortedHand[i].key);
          }
        }
      }
      if(numRanks[rank] >= 2){
        //if a previous rank had a pair, now there are 2 pairs!
        if(handContains.hasPair){
          handContains.has2Pair = true;
          handKeys.keys2Pair = handKeys.keysPair;
          for(const i in sortedHand){
            if(sortedHand[i].rank === rank){
              handKeys.keys2Pair.push(sortedHand[i].key);
            }
          }
        } else{
          handContains.hasPair = true;
          for(const i in sortedHand){
            if(sortedHand[i].rank === rank){
              handKeys.keysPair.push(sortedHand[i].key);
            }
          }
        }
      }
    }
  }
  //use gathered info to determine which hands count as played
  const playedHand = [
    {'ref': 'flushFive', 'qualifies': handContains.hasFlush && handContains.has5oak, 'scoringKeys': uniq(handKeys.keysFlush.concat(handKeys.keys5oak))},
    {'ref': 'flushHouse', 'qualifies': handContains.hasFlush && handContains.has3oak && handContains.has2Pair, 'scoringKeys': uniq(handKeys.keysFlush.concat(handKeys.keys3oak, handKeys.keys2Pair))},
    {'ref': 'fiveOfAKind', 'qualifies': handContains.has5oak, 'scoringKeys': uniq(handKeys.keys5oak)},
    {'ref': 'straightFlush', 'qualifies': handContains.hasStraight && handContains.hasFlush, 'scoringKeys': uniq(handKeys.keysStraight.concat(handKeys.keysFlush))},
    {'ref': 'fourOfAKind', 'qualifies': handContains.has4oak, 'scoringKeys': uniq(handKeys.keys4oak)},
    {'ref': 'fullHouse', 'qualifies': handContains.has3oak && handContains.has2Pair, 'scoringKeys': uniq(handKeys.keys3oak.concat(handKeys.keys2Pair))},
    {'ref': 'flush', 'qualifies': handContains.hasFlush, 'scoringKeys': uniq(handKeys.keysFlush)},
    {'ref': 'straight', 'qualifies': handContains.hasStraight, 'scoringKeys': uniq(handKeys.keysStraight)},
    {'ref': 'threeOfAKind', 'qualifies': handContains.has3oak, 'scoringKeys': uniq(handKeys.keys3oak)},
    {'ref': 'twoPair', 'qualifies': handContains.has2Pair, 'scoringKeys': uniq(handKeys.keys2Pair)},
    {'ref': 'pair', 'qualifies': handContains.hasPair, 'scoringKeys': uniq(handKeys.keysPair)},
    {'ref': 'highCard', 'qualifies': true, 'scoringKeys': handKeys.keyHighCard},
  ]
  let scoringKeys = [];
  let playedHandType;
  //goes through potential played hands and selects the highest priority one that qualifies
  for (let handType of playedHand){
    if (handType.qualifies){
      playedHandType = handType.ref;
      scoringKeys = handType.scoringKeys;
      break;
    }
  }
  //stone cards always score
  for (let card of hand){
    if(card.type === 'stone')
      scoringKeys.push(card.key);
  }

  //splash makes all cards score
  let scoringCards;
  if (jokerMods.hasSplash)
    scoringCards = hand;
  else
    scoringCards = hand.filter((card) => scoringKeys.includes(card.key));
  
  //initialize score based on played hand type
  const scoring = pokerHands[playedHandType].baseScore;

  //initialize variables for adding scoring functions to jokers and cards
  for (let joker of jokers){
    joker.onScoreAdd = [];
    joker.onScoreMult = [];
  }
  for (let card of scoringCards){
    card.onScoreAdd = [];
    card.onScoreMult = [];
    card.onScoreOther = [];
    card.numTriggers = 1;
  }
  for (let card of cards){
    card.onScoreAdd = [];
    card.onScoreMult = [];
    card.onScoreOther = [];
    card.numTriggers = 1;
  }

  //bundle all potentially relevant data to make it simpler to pass to joker functions
  const boardState = {
    'jokers': jokers,
    'jokerMods': jokerMods,
    'scoringCards': scoringCards,
    'cardsHeld': cards,
    'resources': resources,
    'handContains': handContains,
    'numSuits': numSuits,
    'numRanks': numRanks
  }
  
  //go through jokers and run setup code if they have any
  for (let joker of jokers){
    if (joker.code && joker.code.setupScoring instanceof Function){
      joker.code.setupScoring(joker, boardState);
    }
  }
  for (let card of scoringCards){
    rankFunctions[card.rank](card)
    scoredCardTypes[card.type](card)
    if(card.seal)
      scoredSeals[card.seal](card)
  }
  for (let card of cards){
    heldCardTypes[card.type](card)
    if(card.seal)
      heldSeals[card.seal](card)
  }

  for (let card of scoringCards){
    for (action of card.onScoreOther)
      action(boardState);
    for (action of card.onScoreAdd)
      action(scoring)
    for (action of card.onScoreMult)
      action(scoring)
  }

  for (let card of cards){
    for (action of card.onScoreOther)
      action(boardState);
    for (action of card.onScoreAdd)
      action(scoring)
    for (action of card.onScoreMult)
      action(scoring)
  }

  //score jokers
  for (let i in jokers){
    for (let j = 0; j < jokers[i].onScoreAdd.length; j++){
      jokers[i].onScoreAdd[j](scoring);
    }
    for (let j = 0; j < jokers[i].onScoreMult.length; j++){
      jokers[i].onScoreMult[j](scoring);
    }
  }

  let totalScore = scoring.chips * scoring.mult;

  res.json({'scoredHand': pokerHands[playedHandType].name, 'score': totalScore, 'scoreComp': scoring, 'scoringCardsDebug': scoringCards});
});

module.exports = router;