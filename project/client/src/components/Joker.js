import { useState, useEffect, useRef } from 'react';
import { Spinner, Card, Button } from 'react-bootstrap';
import { createPortal } from 'react-dom';
import Select from 'react-dropdown-select';
import { jokerOptions, lifespanOptions, debuffOptions } from './optionArrays';

const SERVHOST = process.env.REACT_APP_SERVHOST || 'http://localhost:8000';

const Joker = ({index, data, move, remove, rootRef, scrollRef}) => {
  if(!Object.hasOwn(data, 'joker')){
    data.joker = 'jimbo';
  }

  const thisRef = useRef();
  const infoRef = useRef();

  const [whichJoker, setWhichJoker] = useState(data.joker);
  const [jokerLifespan, setJokerLifespan] = useState(data.lifespan);
  const [jokerDebuff, setJokerDebuff] = useState(data.debuff);
  const [jokerImg, setJokerImg] = useState(null);
  const [jokerName, setJokerName] = useState('');
  const [jokerDesc, setJokerDesc] = useState('');
  const [jokerRarity, setJokerRarity] = useState('');
  const [jokerValue, setJokerValue] = useState(0);
  const [infoLeft, setInfoLeft] = useState(-10000); //negative value to render offscreen until position is determined
  const [infoTop, setInfoTop] = useState(-10000);
  const [isLoading, setLoading] = useState(true);
  const [isHover, setHover] = useState(false);
  const [isEditing, setEditing] = useState(false);
  const [isInfoing, setInfoing] = useState(false);
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
    if(!whichJoker)
      return;
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
    const fetchJokerImg = async () => {
      let response = await fetch(`${SERVHOST}/build/joker`, {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      let imgURL = await response.text();
      setJokerImg(imgURL);
      setLoading(false);
    }
    const fetchJokerInfo = async () => {
      let response = await fetch(`${SERVHOST}/query`, {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({'joker': data.joker})
      });
      let json = await response.json();
      data.info = {'name': json.name, 'description': json.description, 'rarity': json.rarity, 'value': json.value, 'implemented': json.implemented};
      setJokerName(data.info.name);
      setJokerDesc(data.info.description);
      setJokerRarity(data.info.rarity);
      setJokerValue(data.info.value);
    }
    fetchJokerImg();
    fetchJokerInfo();
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
      <div ref={thisRef} onMouseEnter={() => setHover(true)}
      onMouseLeave={() => {
        setHover(false);
        setEditing(false);
        setInfoing(false);
        if(!whichJoker)
          setWhichJoker(data.joker);
      }}
      style={{alignSelf: 'center'}}>
        <img src={jokerImg} alt="" style={{alignSelf: 'center'}}/>
        {isHover && createPortal(
          <Card ref={infoRef} bg='primary' text='light'
            style={{width: '180px', position: 'absolute', left: infoLeft, top: infoTop}}>
            {!isEditing && !isInfoing ? (
              <>
                <Card.Header>{jokerName}</Card.Header>
                <Button onClick={() => {setEditing(true); setInfoTop(currentValue => currentValue)}}>Edit Joker</Button>
                <Button onClick={() => {setInfoing(true); setInfoTop(currentValue => currentValue)}}>View Info</Button>
                <div style={{flexDirection: 'row', width: '100%'}}>
                  <Button style={{width: '50%'}} onClick={() => move(index, -1)}>&lt;--</Button>
                  <Button style={{width: '50%'}} onClick={() => move(index, 1)}>--&gt;</Button>
                </div>
              </>
            ) : (isEditing ? ( 
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
                <Button variant='danger' onClick={() => remove(index)}>Delete Joker</Button>
              </Card.Body>
            ) : (
              <Card.Body>
                <Card.Text>{jokerDesc}</Card.Text>
                <Card.Text>{jokerRarity}</Card.Text>
                <Card.Text>Sell Value: ${Math.max(1, Math.floor(jokerValue / 2))}</Card.Text>
              </Card.Body>
            ))
            }
          </Card>, rootRef.current
        )}
      </div>
    )
  );
}

export default Joker;