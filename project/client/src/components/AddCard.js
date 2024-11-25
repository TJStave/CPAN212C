import { useState, useEffect, useRef } from 'react';
import { Spinner, Card, Button } from 'react-bootstrap';
import { createPortal } from 'react-dom';
import Select from 'react-dropdown-select';
import { suitOptions, rankOptions, typeOptions, sealOptions } from './optionArrays';
import fetch from 'node-fetch';

const SERVPORT = process.env.REACT_APP_SERVPORT || 8000;
const SERVHOST = process.env.REACT_APP_SERVHOST || 'http://localhost';

const AddCard = ({add, rootRef, scrollRef}) => {
  const thisRef = useRef(null);
  const infoRef = useRef(null);

  const [cardSuit, setCardSuit] = useState('spades');
  const [cardRank, setCardRank] = useState('Ace');
  const [cardType, setCardType] = useState('normal');
  const [cardSeal, setCardSeal] = useState();
  const [cardImg, setCardImg] = useState(null);
  const [infoLeft, setInfoLeft] = useState(-10000); //negative value to render offscreen until position is determined
  const [infoTop, setInfoTop] = useState(-10000);
  const [isLoading, setLoading] = useState(true);
  const [isHover, setHover] = useState(false);

  const findValue = (optionsArray, currentValue) => {
    let foundOption = {};
    for (let i = 0; i < optionsArray.length; i++) {
      if(optionsArray[i].value === currentValue){
        foundOption = optionsArray[i];
        break;
      }
    }
    return [foundOption];
  }

  const centerElement = (parentRef, childRef, grandRef, elderRef) => {
    let parentCenter = (parentRef.current.offsetLeft + (parentRef.current.offsetWidth / 2)) - grandRef.current.scrollLeft;
    let childLeft = parentCenter - (childRef.current.offsetWidth / 2);
    if (childLeft + childRef.current.offsetWidth > elderRef.current.offsetWidth){
      childLeft = elderRef.current.offsetWidth - childRef.current.offsetWidth;
    }
    return childLeft
  }

  const bottomElement = (parentRef, childRef) => {
    return (parentRef.current.offsetTop - childRef.current.offsetHeight + 10);
  }

  const addCard = () => {
    const card = {'suit': cardSuit, 'rank': cardRank, 'type': cardType, 'key': crypto.randomUUID()};
    if (cardSeal)
      card.seal = cardSeal;
    add(card);
  }

  useEffect(() => {
    const fetchCard = async () => {
      const response = await fetch(`${SERVHOST}:${SERVPORT}/build/newCard`);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setCardImg(url);
      setLoading(false);
    }
    fetchCard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if(infoRef.current && thisRef.current){
      setInfoLeft(centerElement(thisRef, infoRef, scrollRef, rootRef));
      setInfoTop(bottomElement(thisRef, infoRef));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHover])

  return(
    isLoading ? <Spinner /> : (
      <div ref={thisRef} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} style={{alignSelf: 'flex-end'}}>
        <img src={cardImg} alt=""/>
        {isHover && createPortal(
          <Card ref={infoRef} bg='primary' text='light'
            style={{width: '180px', position: 'absolute', left: infoLeft, top: infoTop}}>
            <Card.Body>
              <Select
                options={suitOptions}
                values={findValue(suitOptions, cardSuit)}
                onChange={(value) => setCardSuit(value[0].value)}
                searchable='false'
                placeholder='Suit'
                dropdownHeight='200px'
                style={{color: 'black'}}
              />
              <Select
                options={rankOptions}
                values={[{'label': cardRank}]}
                onChange={(value) => setCardRank(value[0].label)}
                valueField='label'
                searchable='false'
                placeholder='Rank'
                dropdownHeight='200px'
                style={{color: 'black'}}
              />
              <Select
                options={typeOptions}
                values={findValue(typeOptions, cardType)}
                onChange={(value) => setCardType(value[0].value)}
                searchable='false'
                placeholder='Enhancement'
                dropdownHeight='200px'
                style={{color: 'black'}}
              />
              <Select
                options={sealOptions}
                values={findValue(sealOptions, cardSeal)}
                onChange={(value) => setCardSeal(value[0].value)}
                valueField='label'
                searchable='false'
                placeholder='Seal'
                dropdownHeight='200px'
                style={{color: 'black'}}
              />
              <Button onClick={addCard}>Add Card</Button>
            </Card.Body>
          </Card>, rootRef.current
        )}
      </div>
    )
  );
}

export default AddCard;