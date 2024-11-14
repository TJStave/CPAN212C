import { useState, useEffect, useRef } from 'react';
import { Spinner, Card, Button } from 'react-bootstrap';
import { createPortal } from 'react-dom';
import Select from 'react-dropdown-select';
import { jokerOptions, lifespanOptions, debuffOptions } from './optionArrays';

const AddJoker = ({add, rootRef, scrollRef}) => {
  const thisRef = useRef(null);
  const infoRef = useRef(null);

  const [whichJoker, setWhichJoker] = useState(null);
  const [jokerLifespan, setJokerLifespan] = useState();
  const [jokerDebuff, setJokerDebuff] = useState();
  const [jokerImg, setJokerImg] = useState(null);
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
    return (parentRef.current.offsetTop + childRef.current.offsetHeight - 10);
  }

  const addJoker = () => {
    if (!whichJoker)
      return;
    const joker = {'joker': whichJoker, 'key': crypto.randomUUID()};
    if (jokerLifespan)
      joker.lifespan = jokerLifespan;
    if (jokerDebuff)
      joker.debuff = jokerDebuff;
    add(joker);
    setWhichJoker(null);
  }

  useEffect(() => {
    const fetchCard = async () => {
      const response = await fetch('http://localhost:8000/build/newCard');
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setJokerImg(url);
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
        <img src={jokerImg} alt=""/>
        {isHover && createPortal(
          <Card ref={infoRef} bg='primary' text='light'
            style={{width: '180px', position: 'absolute', left: infoLeft, top: infoTop}}>
            <Card.Body>
            <Select
                  options={jokerOptions}
                  values={findValue(jokerOptions, whichJoker)}
                  onChange={(value) => {
                    if(value[0])
                      setWhichJoker(value[0].value);
                    else
                      setWhichJoker(null);
                  }}
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
              <Button onClick={addJoker}>Add Joker</Button>
            </Card.Body>
          </Card>, rootRef.current
        )}
      </div>
    )
  );
}

export default AddJoker;