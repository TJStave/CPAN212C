import './App.css';
import CardContainer from './components/CardContainer';
import JokerContainer from './components/JokerContainer';
import { useRef } from 'react';

function App() {
  /*
  This ref is part of a hacky workaround that is only necessary 
  because of how browsers treat overflow when it has different values on x and y
  if only one value is set as visible and the other is something else
  the browser decides you're a dumbass and changes the visible one to auto
  */
  const appRef = useRef();
  return (
    <div className="App" ref={appRef}>
      <JokerContainer/>
      <CardContainer rootRef={appRef}/>
    </div>
  );
}

export default App;
