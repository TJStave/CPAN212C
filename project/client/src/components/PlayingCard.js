import { useState, useEffect, useRef } from 'react';
import { Spinner, Card, Button } from 'react-bootstrap';
import { createPortal } from 'react-dom';
import Select from 'react-dropdown-select';
import { suitOptions, rankOptions, typeOptions, sealOptions } from './optionArrays';
import fetch from 'node-fetch';

const SERVPORT = process.env.REACT_APP_SERVPORT || 8000;
const SERVHOST = process.env.REACT_APP_SERVHOST || 'http://localhost';

const PlayingCard = ({index, data, cardsSelected: [numSelected, setNumSelected], move, remove, rootRef, scrollRef}) => {
  if(!Object.hasOwn(data, 'suit')){
    data.suit = 'spades';
  }
  if(!Object.hasOwn(data, 'rank')){
    data.rank = 'Ace';
  }
  if(!Object.hasOwn(data, 'type')){
    data.type = 'normal';
  }

  const thisRef = useRef(null);
  const infoRef = useRef(null);

  const [cardSuit, setCardSuit] = useState(data.suit);
  const [cardRank, setCardRank] = useState(data.rank);
  const [cardType, setCardType] = useState(data.type);
  const [cardSeal, setCardSeal] = useState(data.seal);
  const [cardImg, setCardImg] = useState(null);
  const [infoLeft, setInfoLeft] = useState(-10000); //negative value to render offscreen until position is determined
  const [infoTop, setInfoTop] = useState(-10000);
  const [isLoading, setLoading] = useState(true);
  const [isHover, setHover] = useState(false);
  const [isSelected, setSelected] = useState(false);
  const [isEditing, setEditing] = useState(false);
  const [fetchTrigger, setFetchTrigger] = useState(false);

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

  const selectCard = () => {
    if (isSelected){
      setSelected(false);
      setNumSelected(num => num - 1);
      if(Object.hasOwn(data, 'selected')){
        delete data.selected;
      }
    } else if(numSelected < 5){
      setSelected(true);
      setNumSelected(num => num + 1);
      data.selected = true;
    }
  }

  useEffect(() => {
    data.suit = cardSuit;
    setFetchTrigger(state => !state);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cardSuit]);
  useEffect(() => {
    data.rank = cardRank;
    setFetchTrigger(state => !state);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cardRank]);
  useEffect(() => {
    data.type = cardType;
    setFetchTrigger(state => !state);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cardType]);
  useEffect(() => {
    if (cardSeal != null){
      data.seal = cardSeal;
    } else if (cardSeal == null && Object.hasOwn(data, 'seal')){
      delete data.seal;
    }
    setFetchTrigger(state => !state);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cardSeal]);

  useEffect(() => {
    const fetchCard = async () => {
      const response = await fetch(`${SERVHOST}:${SERVPORT}/build/card`, {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      const imgURL = await response.text();
      setCardImg(imgURL);
      setLoading(false);
    }
    fetchCard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchTrigger]);

  useEffect(() => {
    if(infoRef.current && thisRef.current){
      setInfoLeft(centerElement(thisRef, infoRef, scrollRef, rootRef));
      setInfoTop(bottomElement(thisRef, infoRef));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHover, isSelected])

  return(
    isLoading ? <Spinner /> : (
      <div ref={thisRef} onMouseEnter={() => setHover(true)} onMouseLeave={() => {setHover(false); setEditing(false)}} style={{alignSelf: isSelected ? 'flex-start' : 'flex-end'}}>
        <img src={cardImg} onClick={selectCard} alt=""/>
        {isHover && createPortal(
          <Card ref={infoRef} bg='primary' text='light'
            style={{width: '180px', position: 'absolute', left: infoLeft, top: infoTop}}>
            {!isEditing ? (
              <>
                {cardType !== 'stone' && (
                  <Card.Header>
                    {cardRank} of {cardSuit.charAt(0).toUpperCase() + cardSuit.slice(1)}
                  </Card.Header>
                )}
                <Button onClick={() => {setEditing(true); setInfoTop(currentValue => currentValue - 60)}}>Edit Card</Button>
                <div style={{flexDirection: 'row', width: '100%'}}>
                  <Button style={{width: '50%'}} onClick={() => move(index, -1)}>&lt;--</Button>
                  <Button style={{width: '50%'}} onClick={() => move(index, 1)}>--&gt;</Button>
                </div>
              </>
            ) : (
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
                <Button variant='danger' onClick={() => remove(index)}>Delete Card</Button>
              </Card.Body>
            )}
          </Card>, rootRef.current
        )}
      </div>
    )
  );
}

export default PlayingCard;