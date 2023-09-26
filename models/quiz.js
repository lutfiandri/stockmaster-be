const mongoose = require('mongoose');

const scoreSchema = new mongoose.Schema(
  {
    email: String,
    numOfTrue: Number,
    point: Number,
  },
  { timestamps: true }
);

const quizSchema = new mongoose.Schema(
  {
    questionIds: [mongoose.Schema.Types.ObjectId],
    scores: [scoreSchema],
  },
  { timestamps: true }
);

const Quiz = mongoose.model('Quiz', quizSchema);

module.exports = Quiz;
