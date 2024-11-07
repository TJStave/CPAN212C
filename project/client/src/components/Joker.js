import { useState, useEffect, useRef } from 'react';
import { Spinner, Card, Button } from 'react-bootstrap';
import { createPortal } from 'react-dom';
import Select from 'react-dropdown-select';
import { jokerOptions, lifespanOptions, debuffOptions } from './optionArrays';

const Joker = ({index, data, move, rootRef, scrollRef}) => {
  if(!Object.hasOwn(data, 'joker')){
    data.joker = 'jimbo';
  }

  const thisRef = useRef();
  const infoRef = useRef();

  const [whichJoker, setWhichJoker] = useState(data.joker);
  const [jokerLifespan, setJokerLifespan] = useState(data.lifespan);
  const [jokerDebuff, setJokerDebuff] = useState(data.debuff);
  const [jokerImg, setJokerImg] = useState(null);
  const [infoLeft, setInfoLeft] = useState(-10000); //negative value to render offscreen until position is determined
  const [infoTop, setInfoTop] = useState(-10000);
  const [isLoading, setLoading] = useState(true);
  const [isHover, setHover] = useState(false);
  const [isEditing, setEditing] = useState(false);
  const [fetchTrigger, setFetchTrigger] = useState(false);

  const centerElement = (parentRef, childRef, grandRef, elderRef) => {
    let parentCenter = (parentRef.current.offsetLeft + (parentRef.current.offsetWidth / 2)) - grandRef.current.scrollLeft;
    let childLeft = parentCenter - (childRef.current.offsetWidth / 2);
    if (childLeft + childRef.current.offsetWidth > elderRef.current.offsetWidth){
      childLeft = elderRef.current.offsetWidth - childRef.current.offsetWidth;
    }
    return childLeft
  }

  const bottomElement = (parentRef) => {
    return (parentRef.current.offsetTop + parentRef.current.offsetHeight - 10);
  }

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

  useEffect(() => {
    data.joker = whichJoker;
    setFetchTrigger(state => !state);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [whichJoker]);
  useEffect(() => {
    if (jokerLifespan != null){
      data.lifespan = jokerLifespan;
    } else if (jokerLifespan == null && data.lifespan != null){
      delete data.lifespan;
    }
    setFetchTrigger(state => !state);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jokerLifespan]);
  useEffect(() => {
    if (jokerDebuff != null){
      data.debuff = jokerDebuff;
    } else if (jokerDebuff == null && data.debuff != null){
      delete data.debuff;
    }
    setFetchTrigger(state => !state);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jokerDebuff]);

  useEffect(() => {
    const fetchJoker = async () => {
      let response = await fetch('http://localhost:8000/build/joker', {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      let imgURL = await response.text();
      setJokerImg(imgURL);
      setLoading(false);
    }
    fetchJoker();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchTrigger]);

  useEffect(() => {
    if(infoRef.current && thisRef.current){
      setInfoLeft(centerElement(thisRef, infoRef, scrollRef, rootRef));
      setInfoTop(bottomElement(thisRef));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHover])

  return(
    isLoading ? <Spinner /> : (
      <div ref={thisRef} onMouseEnter={() => setHover(true)} onMouseLeave={() => {setHover(false); setEditing(false)}} style={{alignSelf: 'center'}}>
        <img src={jokerImg} alt="" style={{alignSelf: 'center'}}/>
        {isHover && createPortal(
          <Card ref={infoRef} bg='primary' text='light'
            style={{width: '180px', position: 'absolute', left: infoLeft, top: infoTop}}>
            {!isEditing ? (
              <>
                <Card.Header>{findValue(jokerOptions, whichJoker)[0].label}</Card.Header>
                <Button onClick={() => {setEditing(true); setInfoTop(currentValue => currentValue)}}>Edit Card</Button>
                <Button onClick={() => move(index, -1)}>&lt;--</Button><Button onClick={() => move(index, 1)}>--&gt;</Button>
              </>
            ) : (
              <Card.Body>
                <Select
                  options={jokerOptions}
                  values={findValue(jokerOptions, whichJoker)}
                  onChange={(value) => setWhichJoker(value[0].value)}
                  placeholder='Select Joker...'
                  dropdownHeight='200px'
                  style={{color: 'black'}}
                />
                <Select
                  options={lifespanOptions}
                  values={findValue(lifespanOptions, jokerLifespan)}
                  onChange={(value) => setJokerLifespan(value[0].value)}
                  valueField='label'
                  searchable='false'
                  placeholder='Lifespan'
                  dropdownHeight='200px'
                  style={{color: 'black'}}
                />
                <Select
                  options={debuffOptions}
                  values={findValue(debuffOptions, jokerDebuff)}
                  onChange={(value) => setJokerDebuff(value[0].value)}
                  valueField='label'
                  searchable='false'
                  placeholder='Debuff'
                  dropdownHeight='200px'
                  style={{color: 'black'}}
                />
              </Card.Body>
            )
            }
          </Card>, rootRef.current
        )}
      </div>
    )
  );
}

export default Joker;