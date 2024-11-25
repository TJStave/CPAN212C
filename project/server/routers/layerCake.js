const express = require('express');
const router = express.Router();
const {createCanvas, loadImage } = require('canvas');
const path = require('path');
const fs = require('fs');

router.get('/newCard', (req, res) => {
  res.sendFile(path.join(__dirname, '../assets/newCard.png'));
})

router.post('/card', async (req, res) => {
  let canvas = createCanvas(142, 190);
  let ctx = canvas.getContext('2d');
  if(req.body.type != 'stone'){
    let typeImg = await loadImage(path.join(__dirname, '../assets/cardBacks/' + req.body.type + 'Card.png'));
    ctx.drawImage(typeImg, 0, 0);
  }
  let faceImg = await loadImage(path.join(__dirname, '../assets/cardFaces/' + req.body.suit + req.body.rank + '.png'));
  ctx.drawImage(faceImg, 0, 0);
  if(req.body.type == 'stone'){
    let typeImg = await loadImage(path.join(__dirname, '../assets/cardBacks/' + req.body.type + 'Card.png'));
    ctx.drawImage(typeImg, 0, 0);
  }
  if(req.body.seal){
    let sealImg = await loadImage(path.join(__dirname, '../assets/cardSeals/' + req.body.seal + 'Seal.png'));
    ctx.drawImage(sealImg, 0, 0);
  }
  res.send(canvas.toDataURL());
});

router.post('/joker', async (req, res) => {
  let canvas;
  if(req.body.joker == 'weeJoker'){
    canvas = createCanvas(71, 95);
  }else if(req.body.joker == 'squareJoker'){
    canvas = createCanvas(142, 142);
  }else if(req.body.joker == 'photograph'){
    canvas = createCanvas(142, 160);
  }else if(req.body.joker == 'halfJoker'){
    canvas = createCanvas(142, 124);
  }else{
    canvas = createCanvas(142, 190);
  }
  let ctx = canvas.getContext('2d');
  if(req.body.joker == 'weeJoker'){
    ctx.scale(0.5, 0.5);
  }

  let jokerImg = await loadImage(path.join(__dirname, '../assets/jokers/' + req.body.joker + '.png'));
  ctx.drawImage(jokerImg, 0, 0);
  if(req.body.lifespan){
    let lifespanImg = await loadImage(path.join(__dirname, '../assets/jokerStickers/' + req.body.lifespan + 'Sticker.png'));
    ctx.drawImage(lifespanImg, 0, 0);
  }
  if(req.body.debuff){
    let debuffImg = await loadImage(path.join(__dirname, '../assets/jokerStickers/' + req.body.debuff + 'Sticker.png'));
    ctx.drawImage(debuffImg, 0, 0);
  }
  if(!fs.existsSync(path.join(__dirname, '../jokerCode/' + req.body.joker + '.js'))){
    let noImpImg = await loadImage(path.join(__dirname, '../assets/noImplementation.png'));
    ctx.drawImage(noImpImg, 0, 0);
  }
  res.send(canvas.toDataURL());
});

module.exports = router;