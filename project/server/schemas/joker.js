const mongoose = require('mongoose');

const jokerSchema = new mongoose.Schema({
  ref: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  implemented: {
    type: Boolean,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  rarity: {
    type: String,
    required: true
  },
  value: {
    type: Number,
    required: true
  }
})

const Joker = mongoose.model('jokers', jokerSchema);
module.exports = Joker;