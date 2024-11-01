import { Button } from "react-bootstrap";
import PlayingCard from "./PlayingCard";

const CardContainer = () => {
  const testCards= [
    {'card': 'stone'},
    {'suit': 'diamonds', 'rank':'Jack', 'card':'gold'},
    {'suit': 'spades', 'rank':'Ace', 'card':'lucky'},
    {'suit': 'hearts', 'rank':'6', 'card':'steel'},
    {'suit': 'clubs', 'rank':'Queen', 'card':'glass'},
    {'suit': 'hearts', 'rank':'9'},
    {'suit': 'diamonds', 'rank':'2', 'card':'wild'},
    {'suit': 'spades', 'rank':'10', 'card':'bonus'}
  ]

  return(
    <div style={{flexDirection: 'row', flexWrap: 'nowrap', overflowX: 'auto'}}>
      <div style={{display: 'inline-flex'}}>
        {
          testCards.map((cardData) => (
            <PlayingCard data={cardData}/>
          ))
        }
      </div>
    </div>
  )
}

export default CardContainer;