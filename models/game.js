const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema(
  {
    questionIds: [mongoose.Schema.Types.ObjectId],
  },
  { timestamps: true }
);

const Game = mongoose.model('Game', gameSchema);

module.exports = Game;
