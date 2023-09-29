const mongoose = require('mongoose');
const { Answer } = require('../models/answer');
const StockPattern = require('../models/stockPattern');
const { Question } = require('../models/question');
const { AnswerAttempt } = require('../models/answerAttempt');
const {
  predictStockPattern,
} = require('../utils/services/predictStockPattern');
const { calculatePoints } = require('../utils/helpers/calculatePoints');
const Game = require('../models/game');

const createAttempt = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.gameId)) {
      return res.status(400).json({
        success: false,
        message: 'invalid objectId in for gameId',
      });
    }

    const user = req.auth.payload.user;

    const gameId = new mongoose.Types.ObjectId(req.params.gameId);

    const pattern = await Game.findOne({
      _id: gameId,
    });

    if (!pattern) {
      return res.status(404).json({
        success: false,
        message: `game ${gameId} not found`,
      });
    }

    const newAttempt = new AnswerAttempt({
      userEmail: user.email,
      gameId: gameId,
      isFinished: false,
      type: 'game',
      totalTrue: 0,
      totalFalse: 0,
      totalPoints: 0,
      totalTimeSeconds: 0,
    });

    const result = await newAttempt.save();
    return res.status(201).json({ success: true, data: result });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const endAttempt = async (req, res) => {
  try {
    const user = req.auth.payload.user;
    if (!mongoose.Types.ObjectId.isValid(req.params.attemptId)) {
      return res.status(400).json({
        success: false,
        message: 'invalid objectId in for attemptId',
      });
    }

    const attemptId = new mongoose.Types.ObjectId(req.params.attemptId);
    const attempt = await AnswerAttempt.findById(attemptId);

    if (!attempt) {
      return res.status(404).json({
        success: false,
        message: `attempt ${attemptId} not found`,
      });
    }

    attempt.isFinished = true;

    const result = await attempt.save();
    return res.status(201).json({ success: true, data: result });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getLastAttempt = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.gameId)) {
      return res.status(400).json({
        success: false,
        message: 'invalid objectId in for gameId',
      });
    }

    const user = req.auth.payload.user;

    const gameId = new mongoose.Types.ObjectId(req.params.gameId);

    const result = await AnswerAttempt.findOne({
      userEmail: user.email,
      gameId: gameId,
    })
      .sort({ _id: -1 })
      .exec();

    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const answerQuestion = async (req, res) => {
  try {
    const user = req.auth.payload.user;

    if (
      !mongoose.Types.ObjectId.isValid(req.params.gameId) ||
      !mongoose.Types.ObjectId.isValid(req.params.attemptId) ||
      !mongoose.Types.ObjectId.isValid(req.params.questionId)
    ) {
      return res.status(400).json({
        success: false,
        message: 'invalid objectId in for gameId, attemptId, and/or questionId',
      });
    }

    const gameId = new mongoose.Types.ObjectId(req.params.gameId);
    const attemptId = new mongoose.Types.ObjectId(req.params.attemptId);
    const questionId = new mongoose.Types.ObjectId(req.params.questionId);
    const { timeSeconds, answer: ans } = req.body;

    // check if attempt is not finished yet
    const attempt = await AnswerAttempt.findById(attemptId);
    if (!attempt) {
      return res.status(404).json({
        success: false,
        message: `${user.email} has no attempt ${attemptId}`,
      });
    }
    if (!!attempt.isFinished) {
      return res.status(409).json({
        success: false,
        message: `${user.email} has finished attempt ${attemptId}`,
      });
    }

    // check if this is first answer
    const lastAnswers = await Answer.find({
      userEmail: user.email,
      attemptId: attemptId,
      questionId: questionId,
    });

    // TODO: uncomment when the frontend development is done
    if (lastAnswers.length > 0) {
      return res.status(409).json({
        success: false,
        message: `${user.email} has answered question ${questionId} on attempt ${attemptId}`,
      });
    }

    // answering process
    const answer = new Answer({
      userEmail: user.email,
      attemptId: attemptId,
      questionId: questionId,
      answer: ans,
      points: 0,
      timeSeconds: timeSeconds,
      isTrue: false,
    });

    const game = await Game.findById(gameId);

    if (!game) {
      return res.status(404).json({
        success: false,
        message: `game ${gameId} not found`,
      });
    }

    if (!game.questionIds.includes(questionId)) {
      return res.status(404).json({
        success: false,
        message: `game ${gameId} does not have question ${questionId}`,
      });
    }

    const question = await Question.findById(questionId);

    let handwriteResult = null;

    if (question.type === 'handwrite') {
      handwriteResult = await predictStockPattern(answer.answer);
      answer.answer = handwriteResult.data.className;
      if (handwriteResult.data.className === question.pattern) {
        answer.isTrue = true;
        answer.points = calculatePoints(timeSeconds);
      }
    } else {
      if (answer.answer === question.multipleChoice.trueOptionId) {
        answer.isTrue = true;
        answer.points = calculatePoints(timeSeconds);
      }
    }

    const saveResult = await answer.save();
    const result = saveResult.toObject();

    if (question.type === 'handwrite') {
      result.truePattern = question.pattern;
    } else {
      result.trueOptionId = question.multipleChoice.trueOptionId;
    }

    // update attempt
    attempt.lastAnsweredQuestionId = question;
    if (answer.isTrue) {
      attempt.totalTrue += 1;
    } else {
      attempt.totalFalse += 1;
    }
    attempt.totalPoints += answer.points;
    attempt.totalTimeSeconds += timeSeconds;
    attempt.lastAnsweredQuestionId = questionId;
    await attempt.save();

    return res.json({ success: true, data: result });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createAttempt,
  endAttempt,
  getLastAttempt,
  answerQuestion,
};
