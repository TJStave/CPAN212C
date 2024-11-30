const express = require('express');
const router = express.Router();
const Joker = require('../schemas/joker');
const GameState = require('../schemas/gameState');

router.post('/getJoker', (req, res) => {
  Joker.findOne({ref: req.body.joker})
    .then((joker) => {
      res.json(joker);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

router.post('/savedHands', (req, res) => {
  const newGameState = new GameState(req.body);
  newGameState.save()
    .then((saved) => {
      console.log(saved);
      res.send();
    })
    .catch((err) => {
      res.status(400).send(err);
    })
});

router.get('/savedHands', (req, res) => {
  GameState.find()
    .then((hands) => {
      res.json(hands);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

module.exports = router;