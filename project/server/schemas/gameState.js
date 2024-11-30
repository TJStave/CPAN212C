const mongoose = require('mongoose');

const gameStateSchema = new mongoose.Schema({
  savedName: {
    type: String,
    required: true
  },
  score: {
    handType: {
      type: String,
      required: true
    },
    total: {
      type: Number,
      required: true
    },
    chips: {
      type: Number,
      required: true
    },
    mult: {
      type: Number,
      required: true
    }
  },
  statusState: {
    hands: {
      type: Number,
      required: true
    },
    discards: {
      type: Number,
      required: true
    },
    money: {
      type: Number,
      required: true
    }
  },
  jokers: [
    {
      _id: false,
      joker: {
        type: String,
        required: true
      },
      lifespan: {
        type: String,
        required: false
      },
      debuff: {
        type: String,
        required: false
      },
      key: {
        type: String,
        required: true
      }
    }
  ],
  playedCards: [
    {
      _id: false,
      suit: {
        type: String,
        required: true
      },
      rank: {
        type: String,
        required: true
      },
      type: {
        type: String,
        required: true
      },
      seal: {
        type: String,
        required: false
      },
      key: {
        type: String,
        required: true
      },
      selected: {
        type: Boolean,
        required: true
      }
    }
  ],
  heldCards: [
    {
      _id: false,
      suit: {
        type: String,
        required: true
      },
      rank: {
        type: String,
        required: true
      },
      type: {
        type: String,
        required: true
      },
      seal: {
        type: String,
        required: false
      },
      key: {
        type: String,
        required: true
      }
    }
  ]
})

const GameState = mongoose.model('saved_states', gameStateSchema);
module.exports = GameState;