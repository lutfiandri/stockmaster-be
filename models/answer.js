const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema(
  {
    userEmail: String,
    attemptId: mongoose.Types.ObjectId,
    questionId: mongoose.Types.ObjectId,
    answer: String,
    isTrue: Boolean,
    timeSeconds: Number,
    points: Number,
  },
  { timestamps: true }
);

const Answer = mongoose.model('Answer', answerSchema);

module.exports = { answerSchema, Answer };
