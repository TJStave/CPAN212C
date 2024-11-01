import { Button } from "react-bootstrap";
import PlayingCard from "./PlayingCard";

const CardContainer = ({rootRef}) => {
  const testCards= [
    {'type': 'stone', 'seal': 'gold'},
    {'suit': 'diamonds', 'rank': 'Jack', 'type': 'gold', 'seal': 'blue'},
    {'suit': 'spades', 'rank': 'Ace', 'type': 'lucky'},
    {'suit': 'hearts', 'rank': '6', 'type': 'steel', 'seal': 'red'},
    {'suit': 'clubs', 'rank': 'Queen', 'type': 'glass'},
    {'suit': 'hearts', 'rank': '9', 'seal': 'purple'},
    {'suit': 'clubs', 'rank': 'King', 'type': 'mult'},
    {'suit': 'diamonds', 'rank': '2', 'type': 'wild'},
    {'suit': 'spades', 'rank': '10', 'type': 'bonus'}
  ]

  return(
    <div style={{flexDirection: 'row', flexWrap: 'nowrap', overflowX: 'auto'}}>
      <div style={{display: 'inline-flex'}}>
        {
          testCards.map((cardData) => (
            <PlayingCard data={cardData} rootRef={rootRef}/>
          ))
        }
      </div>
    </div>
  )
}

export default CardContainer;