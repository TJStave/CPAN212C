import { Card, CardImg, CardImgOverlay, Spinner } from 'react-bootstrap';
import { useState, useRef, useEffect } from 'react';
import Select from 'react-dropdown-select';

const PlayingCard = ({data}) => {
  const canvasRef = useRef(null);
  const backRef = useRef(null);
  const faceRef = useRef(null);

  if(!Object.hasOwn(data, 'suit')){
    data.suit = 'spades';
  }
  if(!Object.hasOwn(data, 'rank')){
    data.rank = 'Ace';
  }
  if(!Object.hasOwn(data, 'card')){
    data.card = 'normal';
  }

  const [cardFace, setCardFace] = useState(null);
  const [cardBack, setCardBack] = useState(null);
  const [cardSuit, setCardSuit] = useState(data.suit);
  const [cardRank, setCardRank] = useState(data.rank);
  const [cardCard, setCardCard] = useState(data.card);
  const [cardImg, setCardImg] = useState(null);
  const [isHover, setHover] = useState(false);
  const [faceLoaded, setFaceLoaded] = useState(false);
  const [backLoaded, setBackLoaded] = useState(false);

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

  const cardOptions = [
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

  useEffect(() => {
    setFaceLoaded(false);
    setCardFace(require('../assets/cardFaces/' + cardSuit + cardRank + '.png'));
  }, [cardRank, cardSuit]);

  useEffect(() => {
    setBackLoaded(false);
    setCardBack(require('../assets/cardBacks/' + cardCard + 'Card.png'));
  }, [cardCard]);

  useEffect(() => {data.suit = cardSuit}, [cardSuit]);
  useEffect(() => {data.rank = cardRank}, [cardRank]);

  useEffect(() => {
    const context = canvasRef.current.getContext('2d');
    context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    if(cardCard != 'stone'){
      context.drawImage(backRef.current, 0, 0);
    }
    context.drawImage(faceRef.current, 0, 0);
    if(cardCard == 'stone'){
      context.drawImage(backRef.current, 0, 0);
    }
    canvasRef.current.toBlob((blob) => {
      setCardImg(URL.createObjectURL(blob));
    });
  }, [faceLoaded, backLoaded]);

  return(
    <>
      <img
        ref={backRef}
        src={cardBack}
        alt=""
        width="142"
        height="190"
        onLoad={() => setBackLoaded(true)}
        style={{display: 'none'}}
      />
      <img
        ref={faceRef}
        src={cardFace}
        alt=""
        width="142"
        height="190"
        onLoad={() => setFaceLoaded(true)}
        style={{display: 'none'}}
      />
      <canvas
        ref={canvasRef}
        width="142"
        height="190"
        style={{display: 'none'}}
      />
      <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} style={{position: 'relative'}}>
        <img src={cardImg}/>
        {isHover && (
          <div style={{flexDirection: 'column', width: '100%', position: 'absolute', top: '0px', left: '0px', zIndex: 2}}>
            <Select
              options={suitOptions}
              onChange={(value) => setCardSuit(value[0].value)}
              searchable='false'
            />
            <Select
              options={rankOptions}
              onChange={(value) => setCardRank(value[0].label)}
              valueField='label'
              dropdownHeight='200px'
              searchable='false'
            />
            <Select
              options={cardOptions}
              onChange={(value) => setCardCard(value[0].value)}
              dropdownHeight='200px'
              searchable='false'
            />
          </div>
        )}
      </div>
    </>
  );
}

export default PlayingCard;