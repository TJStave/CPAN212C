import { Button } from "react-bootstrap";
import PlayingCard from "./PlayingCard";
import { useRef, useState } from "react";
import clamp from 'lodash/clamp';

const CardContainer = ({rootRef, cards}) => {
  const containerRef = useRef(null);

  const [sortTrigger, setSortTrigger] = useState(null);

  const suitOrder = [
    'spades',
    'hearts',
    'clubs',
    'diamonds'
  ];

  const rankOrder = [
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '10',
    'Jack',
    'Queen',
    'King',
    'Ace'
  ];

  const sortCards = () => {
    cards.sort((a, b) => {return (a.type === 'stone' ? suitOrder.length : suitOrder.indexOf(a.suit))
      -  (b.type === 'stone' ? suitOrder.length : suitOrder.indexOf(b.suit))});
    cards.sort((a, b) => {return (b.type === 'stone' ? -1 : rankOrder.indexOf(b.rank))
      - (a.type === 'stone' ? -1 : rankOrder.indexOf(a.rank))});
    setSortTrigger({...sortTrigger});
  }

  const moveCard = (index, direction) => {
    //apparently this is an ES6 feature
    [cards[index], cards[clamp(index + direction, 0, cards.length - 1)]] = [cards[clamp(index + direction, 0, cards.length - 1)], cards[index]];
  }

  const createCard = (card) => {
    cards[cards.length] = card;
  }

  return(
    <div>
      <div ref={containerRef} style={{flexDirection: 'row', flexWrap: 'nowrap', overflowX: 'auto'}}>
        <div style={{display: 'inline-flex'}}>
          {
            cards.map((cardData, cardIndex) => (
              <PlayingCard key={cardData.key} index={cardIndex} numCards={cards.length} data={cardData} move={moveCard} rootRef={rootRef} scrollRef={containerRef}/>
            ))
          }
        </div>
      </div>
      <Button onClick={() => sortCards()}>Sort</Button>
    </div>
  )
}

export default CardContainer;