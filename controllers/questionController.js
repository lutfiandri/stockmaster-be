const mongoose = require('mongoose');
const { Question } = require('../models/question');

const addQuestion = async (req, res) => {
  try {
    const now = new Date();
    const question = new Question({
      ...req.body,
      createdAt: now,
      updatedAt: now,
    });

    const err = question.validateSync();
    if (err) {
      return res.status(400).json({
        success: false,
        validationError: err.errors,
        message: err.message,
      });
    }

    const result = await question.save();

    return res.json({ success: true, data: result });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const addManyQuestions = async (req, res) => {
  try {
    const now = new Date();

    if (!req.body.questions) {
      return res.status(400).json({
        success: false,
        message: 'field "questions" is required',
      });
    }

    const questions = [];
    const errs = [];

    req.body.questions.forEach((q) => {
      const question = new Question({
        ...q,
        createdAt: now,
        updatedAt: now,
      });
      questions.append(question);

      const err = question.validateSync();
      if (err) {
        err.id = question.id;
        errs.append(err);
      }
    });

    if (errs.length > 0) {
      return res.status(400).json({
        success: false,
        validationErrors: errs,
        message: 'there are validation error(s)',
      });
    }

    const result = await Question.insertMany(questions);

    return res.json({ success: true, data: result, count: questions.length });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getQuestions = async (req, res) => {
  try {
    const result = await Question.find();
    return res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'invalid object id',
      });
    }

    const result = await Question.findById(id);
    if (!result) {
      return res.status(404).json({
        success: false,
        message: `question with id ${id} not found`,
      });
    }

    return res.json({ success: true, data: result });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'invalid object id',
      });
    }

    const result = await Question.findById(id);
    if (!result) {
      return res.status(404).json({
        success: false,
        message: `result with id ${id} not found`,
      });
    }

    await Question.deleteOne({ _id: id });

    return res.json({ success: true });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getQuestions,
  getQuestion,
  addQuestion,
  deleteQuestion,
};
