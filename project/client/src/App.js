import './App.css';
import CardContainer from './components/CardContainer';
import JokerContainer from './components/JokerContainer';
import { useRef } from 'react';

function App() {
  return (
    <div className="App">
      <JokerContainer/>
      <CardContainer/>
    </div>
  );
}

export default App;
