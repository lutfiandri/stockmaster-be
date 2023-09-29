const mongoose = require('mongoose');

const answerAttemptSchema = new mongoose.Schema(
  {
    userEmail: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ['learn', 'game'],
    },
    // gameId -> can be gameId or patternId
    gameId: {
      type: String,
      required: true,
    },
    isFinished: {
      type: Boolean,
      required: true,
    },
    lastAnsweredQuestionId: {
      type: mongoose.Types.ObjectId,
      required: false,
    },
    totalTrue: {
      type: Number,
      required: true,
    },
    totalFalse: {
      type: Number,
      required: true,
    },
    totalPoints: {
      type: Number,
      required: true,
    },
    totalTimeSeconds: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const AnswerAttempt = mongoose.model('AnswerAttempt', answerAttemptSchema);

module.exports = { answerAttemptSchema, AnswerAttempt };
