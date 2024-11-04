import { useRef } from 'react';
import './App.css';
import CardContainer from './components/CardContainer';
import JokerContainer from './components/JokerContainer';
import StatusBar from './components/StatusBar';

function App() {
  const testJokers = [
    {'joker': 'halfJoker', 'lifespan': 'perishable', 'key': crypto.randomUUID()},
    {'joker': 'steelJoker', 'lifespan': 'eternal', 'key': crypto.randomUUID()},
    {'joker': 'weeJoker', 'lifespan': 'eternal', 'debuff': 'rental', 'key': crypto.randomUUID()},
    {'joker': 'photograph', 'debuff': 'rental', 'key': crypto.randomUUID()},
    {'joker': 'squareJoker', 'key': crypto.randomUUID()}
  ]
  const testCards = [
    {'type': 'stone', 'seal': 'gold', 'key': crypto.randomUUID()},
    {'suit': 'diamonds', 'rank': 'Jack', 'type': 'gold', 'seal': 'blue', 'key': crypto.randomUUID()},
    {'suit': 'spades', 'rank': 'Ace', 'type': 'lucky', 'key': crypto.randomUUID()},
    {'suit': 'hearts', 'rank': '6', 'type': 'steel', 'seal': 'red', 'key': crypto.randomUUID()},
    {'suit': 'clubs', 'rank': 'Queen', 'type': 'glass', 'key': crypto.randomUUID()},
    {'suit': 'hearts', 'rank': '9', 'seal': 'purple', 'key': crypto.randomUUID()},
    {'suit': 'clubs', 'rank': 'King', 'type': 'mult', 'key': crypto.randomUUID()},
    {'suit': 'diamonds', 'rank': '2', 'type': 'wild', 'key': crypto.randomUUID()},
    {'suit': 'spades', 'rank': '10', 'type': 'bonus', 'key': crypto.randomUUID()}
  ]

  /*
  This ref is part of a hacky workaround that is only necessary 
  because of how browsers treat overflow when it has different values on x and y
  if only one value is set as visible and the other is something else
  the browser decides you're a dumbass and changes the visible one to auto
  */
  const appRef = useRef();

  return (
    <div className="App" ref={appRef} style={{flex: 1, flexDirection: 'row', alignItems: 'stretch'}}>
      <div style={{display: 'flex', width: '20vw', alignItems: 'stretch'}}>
        <StatusBar/>
      </div>
      <div style={{display: 'flex', width: '80vw', flexDirection: 'column', justifyContent: 'space-between'}}>
        <JokerContainer rootRef={appRef} jokers={testJokers}/>
        <CardContainer rootRef={appRef} cards={testCards}/>
      </div>
    </div>
  );
}

export default App;
