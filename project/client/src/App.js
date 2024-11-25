import { useRef } from 'react';
import { Button } from 'react-bootstrap';
import './App.css';
import CardContainer from './components/CardContainer';
import JokerContainer from './components/JokerContainer';
import StatusBar from './components/StatusBar';

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

  const jokers = [];
  const cards = testCards;
  const statusState = {'hands': 4, 'discards': 3, 'money': 4};
  const scoreResults = {'handSetter': () => {return undefined}, 'scoreSetter': () => {return undefined},
    'chipsSetter': () => {return undefined}, 'multSetter': () => {return undefined}};
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
    console.log(json.scoringCardsDebug);
  }

  return (
    <div className="App" ref={appRef} style={{flex: 1, flexDirection: 'row', alignItems: 'stretch'}}>
      <div style={{display: 'flex', width: '20vw', flexDirection: 'column', justifyContent: 'center'}}>
        <StatusBar state={statusState} results={scoreResults}/>
        <Button onClick={calcScore}>Score</Button>
      </div>
      <div style={{display: 'flex', width: '80vw', flexDirection: 'column', justifyContent: 'space-between'}}>
        <JokerContainer rootRef={appRef} jokers={jokers}/>
        <CardContainer rootRef={appRef} cards={cards}/>
      </div>
    </div>
  );
}

export default App;
