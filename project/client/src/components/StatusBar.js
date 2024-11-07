import { useState, useEffect } from "react";
import { Card } from "react-bootstrap";

const StatusBar = ({state, score}) => {
  const [hands, setHands] = useState(4);
  const [discards, setDiscards] = useState(3);
  const [money, setMoney] = useState(4);

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
        <Card.Text>{score}</Card.Text>
      </Card>
      <div style={{flex: 1, flexDirection: 'row'}}>
        <Card>
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
        </Card>
        <Card>
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
        </Card>
      </div>
      <Card>
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
      </Card>
    </div>
  )
}

export default StatusBar;