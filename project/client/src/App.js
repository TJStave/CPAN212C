import { useRef } from 'react';
import './App.css';
import CardContainer from './components/CardContainer';
import JokerContainer from './components/JokerContainer';
import StatusBar from './components/StatusBar';
import SaveState from './components/SaveState';

const SERVHOST = process.env.REACT_APP_SERVHOST || 'http://localhost:8000';

function App() {
  // const testJokers = [
  //   {'joker': 'halfJoker', 'lifespan': 'perishable', 'key': crypto.randomUUID()},
  //   {'joker': 'steelJoker', 'lifespan': 'eternal', 'key': crypto.randomUUID()},
  //   {'joker': 'weeJoker', 'lifespan': 'eternal', 'debuff': 'rental', 'key': crypto.randomUUID()},
  //   {'joker': 'photograph', 'debuff': 'rental', 'key': crypto.randomUUID()},
  //   {'joker': 'squareJoker', 'key': crypto.randomUUID()}
  // ];
  const testCards = [
    {'type': 'stone', 'key': crypto.randomUUID()},
    {'suit': 'diamonds', 'rank': 'Jack', 'type': 'gold', 'seal': 'blue', 'key': crypto.randomUUID()},
    {'suit': 'spades', 'rank': 'Ace', 'key': crypto.randomUUID()},
    {'suit': 'hearts', 'rank': '6', 'key': crypto.randomUUID()},
    {'suit': 'clubs', 'rank': 'Queen', 'key': crypto.randomUUID()},
    {'suit': 'hearts', 'rank': '9', 'seal': 'purple', 'key': crypto.randomUUID()},
    {'suit': 'clubs', 'rank': 'King', 'key': crypto.randomUUID()},
    {'suit': 'diamonds', 'rank': '2', 'type': 'wild', 'key': crypto.randomUUID()},
    {'suit': 'spades', 'rank': '10', 'key': crypto.randomUUID()}
  ];
  //variables for various things
  const jokers = [];
  const cards = testCards;
  const statusState = {'hands': 4, 'discards': 3, 'money': 4};
  const scoreResults = {'handSetter': () => {return undefined}, 'scoreSetter': () => {return undefined},
    'chipsSetter': () => {return undefined}, 'multSetter': () => {return undefined}, 'disableSave': () => {return undefined}};
  const modalShowers = {'showSave': () => {return undefined}, 'showLoad': () => {return undefined}};
  let lastHand = null;
  /*
  This ref is part of a hacky workaround that is only necessary 
  because of how browsers treat overflow when it has different values on x and y
  if only one value is set as visible and the other is something else
  the browser decides you're a dumbass and changes the visible one to auto
  */
  const appRef = useRef();

  const calcScore = async () => {
    const selectedCards = [];
    const unSelectedCards = [];
    for(const i in cards){
      if (cards[i].selected)
        selectedCards.push(cards[i]);
      else
        unSelectedCards.push(cards[i]);
    }
    if(selectedCards.length < 1){
      return;
    }
    const response = await fetch(`${SERVHOST}/score`, {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({'jokers': jokers, 'hand': selectedCards, 'cards': unSelectedCards, 'resources': statusState})
      });
    let json = await response.json();
    scoreResults.handSetter(json.scoredHand);
    scoreResults.scoreSetter(json.score);
    scoreResults.chipsSetter(json.scoreComp.chips);
    scoreResults.multSetter(json.scoreComp.mult);
    scoreResults.disableSave(false);
    lastHand = {
      'score': {'handType': json.scoredHand, 'total': json.score, 'chips': json.scoreComp.chips, 'mult': json.scoreComp.mult},
      'statusState': {'hands': statusState.hands, 'discards': statusState.discards, 'money': statusState.money},
      'jokers': jokers, 'playedCards': selectedCards, 'heldCards': unSelectedCards
    }
  }

  const saveLastHand = async (savedName) => {
    await fetch(`${SERVHOST}/query/savedHands`, {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({'savedName': savedName, ...lastHand})
      });
  }

  return (
    <div className="App" ref={appRef} style={{flex: 1, flexDirection: 'row', alignItems: 'stretch'}}>
      <div style={{display: 'flex', width: '20vw', flexDirection: 'column', justifyContent: 'center'}}>
        <StatusBar state={statusState} results={scoreResults} scoreButton={calcScore} saveButton={() => modalShowers.showSave(true)} loadButton={modalShowers.showLoad}/>
      </div>
      <div style={{display: 'flex', width: '80vw', flexDirection: 'column', justifyContent: 'space-between'}}>
        <JokerContainer rootRef={appRef} jokers={jokers}/>
        <CardContainer rootRef={appRef} cards={cards}/>
      </div>
      <SaveState showTriggers={modalShowers} saveFunc={saveLastHand}/>
    </div>
  );
}

export default App;
