import { Card, CardImg, CardImgOverlay, Spinner } from 'react-bootstrap';
import { useState, useRef, useEffect } from 'react';
import Select from 'react-dropdown-select';

const PlayingCard = ({data, rootRef}) => {
  const canvasRef = useRef(null);
  const backRef = useRef(null);
  const faceRef = useRef(null);
  const stampRef = useRef(null);

  if(!Object.hasOwn(data, 'suit')){
    data.suit = 'spades';
  }
  if(!Object.hasOwn(data, 'rank')){
    data.rank = 'Ace';
  }
  if(!Object.hasOwn(data, 'type')){
    data.type = 'normal';
  }

  const [cardFace, setCardFace] = useState(null);
  const [cardBack, setCardBack] = useState(null);
  const [cardStamp, setCardStamp] = useState(null);
  const [cardSuit, setCardSuit] = useState(data.suit);
  const [cardRank, setCardRank] = useState(data.rank);
  const [cardType, setCardType] = useState(data.type);
  const [cardSeal, setCardSeal] = useState(data.seal);
  const [cardImg, setCardImg] = useState(null);
  const [isHover, setHover] = useState(false);
  const [faceLoaded, setFaceLoaded] = useState(false);
  const [backLoaded, setBackLoaded] = useState(false);
  const [stampLoaded, setStampLoaded] = useState(false);

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
    setFaceLoaded(false);
    setCardFace(require('../assets/cardFaces/' + cardSuit + cardRank + '.png'));
  }, [cardRank, cardSuit]);

  useEffect(() => {
    setBackLoaded(false);
    setCardBack(require('../assets/cardBacks/' + cardType + 'Card.png'));
  }, [cardType]);

  useEffect(() => {
    setStampLoaded(false);
    if(cardSeal == null){
      setCardStamp(require('../assets/blank.png'));
    } else {
      setCardStamp(require('../assets/cardSeals/' + cardSeal + 'Seal.png'));
    }
  }, [cardSeal]);

  useEffect(() => {data.suit = cardSuit}, [cardSuit]);
  useEffect(() => {data.rank = cardRank}, [cardRank]);
  useEffect(() => {data.type = cardType}, [cardType]);
  useEffect(() => {
    if (cardSeal != null){
      data.seal = cardSeal;
    } else if (cardSeal == null && data.seal != null){
      delete data.seal;
    }
  }, [cardSeal]);

  useEffect(() => {
    const context = canvasRef.current.getContext('2d');
    context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    if(cardType != 'stone'){
      context.drawImage(backRef.current, 0, 0);
    }
    context.drawImage(faceRef.current, 0, 0);
    if(cardType == 'stone'){
      context.drawImage(backRef.current, 0, 0);
    }
    context.drawImage(stampRef.current, 0, 0);
    canvasRef.current.toBlob((blob) => {
      setCardImg(URL.createObjectURL(blob));
    });
  }, [faceLoaded, backLoaded, stampLoaded]);

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
      <img
        ref={stampRef}
        src={cardStamp}
        alt=""
        width="142"
        height="190"
        onLoad={() => setStampLoaded(true)}
        style={{display: 'none'}}
      />
      <canvas
        ref={canvasRef}
        width="142"
        height="190"
        style={{display: 'none'}}
      />
      <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} style={{position: 'relative', height: 190}}>
        <img src={cardImg}/>
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
    </>
  );
}

export default PlayingCard;