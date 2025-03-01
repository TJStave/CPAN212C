import { useState, useEffect } from "react";
import { Card, Button } from "react-bootstrap";

const StatusBar = ({state, results, scoreButton, saveButton, loadButton}) => {
  const [hands, setHands] = useState(4);
  const [discards, setDiscards] = useState(3);
  const [money, setMoney] = useState(4);
  const [score, setScore] = useState(0);
  const [chips, setChips] = useState(0);
  const [mult, setMult] = useState(0);
  const [handType, setHandType] = useState('High Card');
  const [saveDisabled, setSaveDisabled] = useState(true);

  results.scoreSetter = setScore;
  results.handSetter = setHandType;
  results.chipsSetter = setChips;
  results.multSetter = setMult;
  results.disableSave = setSaveDisabled;

  useEffect(() => {
    state.hands = hands;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hands]);
  useEffect(() => {
    state.discards = discards;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [discards]);
  useEffect(() => {
    state.money = money;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [money]);

  return(
    <div style={{flexDirection: 'column'}}>
      <Card>
        <Card.Header>Score</Card.Header>
        <Card.Body>
          <Card.Text>{score}</Card.Text>
          <Card.Text>{chips} X {mult}</Card.Text>
          <Card.Text>{handType}</Card.Text>
        </Card.Body>
        <Card.Header>Hands</Card.Header>
        <Card.Body>
          <input
            type='number'
            value={hands}
            min={1}
            step={1}
            onChange={e => setHands(e.target.value)}
          />
        </Card.Body>
        <Card.Header>Discards</Card.Header>
        <Card.Body>
          <input
            type='number'
            value={discards}
            min={0}
            step={1}
            onChange={e => setDiscards(e.target.value)}
          />
        </Card.Body>
        <Card.Header>Money</Card.Header>
        <Card.Body>
          <input
            type='number'
            value={money}
            min={0}
            step={1}
            onChange={e => setMoney(e.target.value)}
          />
        </Card.Body>
        <Button onClick={scoreButton}>Score</Button>
        <Button onClick={saveButton} disabled={saveDisabled}>Save Last Hand</Button>
        <Button onClick={loadButton}>Load Hand</Button>
      </Card>
    </div>
  )
}

export default StatusBar;