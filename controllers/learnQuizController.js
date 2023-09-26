const mongoose = require('mongoose');
const LearnQuiz = require('../models/learnQuiz');
const { Answer } = require('../models/answer');
const StockPattern = require('../models/stockPattern');
const { Question } = require('../models/question');
const { AnswerAttempt } = require('../models/answerAttempt');

const createAttempt = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.patternId)) {
      return res.status(400).json({
        success: false,
        message: 'invalid objectId in for patternId',
      });
    }

    const user = req.auth.payload.user;

    const patternId = new mongoose.Types.ObjectId(req.params.patternId);

    const pattern = await StockPattern.findOne({
      _id: patternId,
    });

    if (!pattern) {
      return res.status(404).json({
        success: false,
        message: `stock pattern ${patternId} not found`,
      });
    }

    const newAttempt = new AnswerAttempt({
      userEmail: user.email,
      gameId: patternId,
      isFinished: false,
      type: 'learn',
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

const getLastAttempt = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.patternId)) {
      return res.status(400).json({
        success: false,
        message: 'invalid objectId in for patternId',
      });
    }

    const user = req.auth.payload.user;

    const patternId = new mongoose.Types.ObjectId(req.params.patternId);

    const result = await AnswerAttempt.findOne({
      userEmail: user.email,
      gameId: patternId,
    })
      .sort({ _id: -1 })
      .exec();

    console.log(result);
    return res.status(201).json({ success: true, data: result });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const answerQuestion = async (req, res) => {
  try {
    if (
      !mongoose.Types.ObjectId.isValid(req.params.patternId) ||
      !mongoose.Types.ObjectId.isValid(req.params.questionId)
    ) {
      return res.status(400).json({
        success: false,
        message: 'invalid objectId in for patternId and/or questionId',
      });
    }

    const patternId = new mongoose.Types.ObjectId(req.params.patternId);
    const questionId = new mongoose.Types.ObjectId(req.params.questionId);
    const { timeSeconds, answer: ans } = req.body;

    const user = req.auth.payload.user;
    console.log(user);
    const answer = new Answer({
      userEmail: user.email,
      questionId: questionId,
      answer: ans,
      timeSeconds: timeSeconds,
      isTrue: false,
    });

    const pattern = await StockPattern.findOne({
      _id: new mongoose.Types.ObjectId(patternId),
    });

    if (!pattern) {
      return res.status(404).json({
        success: false,
        message: `stock pattern ${patternId} not found`,
      });
    }

    if (!pattern.questionIds.includes(questionId)) {
      return res.status(404).json({
        success: false,
        message: `stock pattern ${patternId} does not have question ${questionId}`,
      });
    }

    const question = await Question.findById(questionId);

    if (question.type === 'handwrite') {
      // ...
    } else {
      if (answer.answer === question.multipleChoice.trueOptionId) {
        answer.isTrue = true;
      }
    }

    // const err = question.validateSync();
    // if (err) {
    //   return res.status(400).json({
    //     success: false,
    //     validationError: err.errors,
    //     message: err.message,
    //   });
    // }

    // const result = await question.save();
    const result = { message: 'ok' };

    return res.json({ success: true, data: result });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createAttempt,
  getLastAttempt,
  answerQuestion,
};
