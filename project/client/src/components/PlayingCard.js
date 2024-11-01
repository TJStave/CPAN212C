import { useState, useEffect } from 'react';
import Select from 'react-dropdown-select';

const PlayingCard = ({data, rootRef}) => {
  if(!Object.hasOwn(data, 'suit')){
    data.suit = 'spades';
  }
  if(!Object.hasOwn(data, 'rank')){
    data.rank = 'Ace';
  }
  if(!Object.hasOwn(data, 'type')){
    data.type = 'normal';
  }

  const [cardSuit, setCardSuit] = useState(data.suit);
  const [cardRank, setCardRank] = useState(data.rank);
  const [cardType, setCardType] = useState(data.type);
  const [cardSeal, setCardSeal] = useState(data.seal);
  const [cardImg, setCardImg] = useState(null);
  const [isHover, setHover] = useState(false);
  const [fetchTrigger, setFetchTrigger] = useState(false);

  const suitOptions = [
    {'label': 'Hearts', 'value': 'hearts'},
    {'label': 'Clubs', 'value': 'clubs'},
    {'label': 'Diamonds', 'value': 'diamonds'},
    {'label': 'Spades', 'value': 'spades'}
  ];
  const rankOptions = [
    {'label': '2'},
    {'label': '3'},
    {'label': '4'},
    {'label': '5'},
    {'label': '6'},
    {'label': '7'},
    {'label': '8'},
    {'label': '9'},
    {'label': '10'},
    {'label': 'Jack'},
    {'label': 'Queen'},
    {'label': 'King'},
    {'label': 'Ace'}
  ];

  const typeOptions = [
    {'label': 'Standard', 'value': 'normal'},
    {'label': 'Bonus', 'value': 'bonus'},
    {'label': 'Mult', 'value': 'mult'},
    {'label': 'Wild', 'value': 'wild'},
    {'label': 'Glass', 'value': 'glass'},
    {'label': 'Steel', 'value': 'steel'},
    {'label': 'Stone', 'value': 'stone'},
    {'label': 'Gold', 'value': 'gold'},
    {'label': 'Lucky', 'value': 'lucky'}
  ]

  const sealOptions = [
    {'label': 'None', 'value': null},
    {'label': 'Gold', 'value': 'gold'},
    {'label': 'Red', 'value': 'red'},
    {'label': 'Blue', 'value': 'blue'},
    {'label': 'Purple', 'value': 'purple'}
  ]

  useEffect(() => {
    data.suit = cardSuit;
    setFetchTrigger(!fetchTrigger);
  }, [cardSuit]);
  useEffect(() => {
    data.rank = cardRank;
    setFetchTrigger(!fetchTrigger);
  }, [cardRank]);
  useEffect(() => {
    data.type = cardType;
    setFetchTrigger(!fetchTrigger);
  }, [cardType]);
  useEffect(() => {
    if (cardSeal != null){
      data.seal = cardSeal;
    } else if (cardSeal == null && data.seal != null){
      delete data.seal;
    }
    setFetchTrigger(!fetchTrigger);
  }, [cardSeal]);

  useEffect(() => {
    const fetchCard = async () => {
      const response = await fetch('http://localhost:8000/build/card', {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      const imgURL = await response.text();
      setCardImg(imgURL);
    }
    fetchCard();
  }, [fetchTrigger]);

  return(
    <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} style={{position: 'relative'}}>
      <img src={cardImg} alt=""/>
      {isHover && (
        <>
          <div style={{height: '100%', width:'100%', position: 'absolute', top: '0px', left: '0px', backgroundColor: '#fff', opacity: 0.5 }}/>
          <div style={{flexDirection: 'column', width: '100%', position: 'absolute', top: '0px', left: '0px', zIndex: 3}}>
            <Select
              options={suitOptions}
              onChange={(value) => setCardSuit(value[0].value)}
              searchable='false'
              portal={rootRef.current}
              placeholder='Suit'
            />
            <Select
              options={rankOptions}
              onChange={(value) => setCardRank(value[0].label)}
              valueField='label'
              searchable='false'
              portal={rootRef.current}
              placeholder='Rank'
            />
            <Select
              options={typeOptions}
              onChange={(value) => setCardType(value[0].value)}
              searchable='false'
              portal={rootRef.current}
              placeholder='Enhancement'
            />
            <Select
              options={sealOptions}
              onChange={(value) => setCardSeal(value[0].value)}
              valueField='label'
              searchable='false'
              portal={rootRef.current}
              placeholder='Seal'
            />
          </div>
        </>
      )}
    </div>
  );
}

export default PlayingCard;