const mongoose = require('mongoose');
const { answerSchema } = require('./answer');

const learnQuizSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    patternId: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    answers: [answerSchema],
  },
  { timestamps: true }
);

const LearnQuiz = mongoose.model('LearnQuiz', learnQuizSchema);

module.exports = LearnQuiz;
