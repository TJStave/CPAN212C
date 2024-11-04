import { useState } from "react";
import { Card } from "react-bootstrap";

const StatusBar = () => {
  const [score, setScore] = useState(0);
  const [hands, setHands] = useState(4);
  const [discards, setDiscards] = useState(3);
  const [money, setMoney] = useState(4);
  return(
    <div style={{flex: 1,  flexDirection: 'column'}}>
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