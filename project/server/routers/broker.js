const express = require('express');
const router = express.Router();
const Joker = require('../schemas/joker')

router.post('/', (req, res) => {
  Joker.find({ref: req.body.joker})
    .then((joker) => {
      res.json(joker[0]);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
})

module.exports = router;