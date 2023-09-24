const mongoose = require('mongoose');
const StockPattern = require('../models/stockPattern');

const addStockPattern = async (req, res) => {
  try {
    const now = new Date();
    const newPattern = new StockPattern({
      ...req.body,
      createdAt: now,
      updatedAt: now,
    });

    const err = newPattern.validateSync();
    if (err) {
      return res.status(400).json({
        success: false,
        validationError: err.errors,
        message: err.message,
      });
    }

    const result = await newPattern.save();

    return res.json({ success: true, data: result });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const addManyStockPatterns = async (req, res) => {
  try {
    const now = new Date();

    if (!req.body.patterns) {
      return res.status(400).json({
        success: false,
        message: 'field "patterns" is required',
      });
    }

    const patterns = [];
    const errs = [];

    req.body.patterns.forEach((p) => {
      const pattern = new StockPattern({
        ...p,
        createdAt: now,
        updatedAt: now,
      });
      patterns.push(pattern);

      const err = pattern.validateSync();
      if (err) {
        err.id = pattern.id;
        errs.push(err);
      }
    });

    if (errs.length > 0) {
      return res.status(400).json({
        success: false,
        validationErrors: errs,
        message: 'there are validation error(s)',
      });
    }

    const result = await StockPattern.insertMany(patterns);

    return res.json({ success: true, data: result, count: patterns.length });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getStockPatterns = async (req, res) => {
  try {
    const result = await StockPattern.find();
    return res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getStockPattern = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'invalid object id',
      });
    }

    const pattern = await StockPattern.findById(id);
    if (!pattern) {
      return res.status(404).json({
        success: false,
        message: `stock pattern with id ${id} not found`,
      });
    }

    return res.json({ success: true, data: pattern });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const deleteStockPattern = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'invalid object id',
      });
    }

    const pattern = await StockPattern.findById(id);
    if (!pattern) {
      return res.status(404).json({
        success: false,
        message: `stock pattern with id ${id} not found`,
      });
    }

    await StockPattern.deleteOne({ _id: id });

    return res.json({ success: true });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getStockPatterns,
  getStockPattern,
  addStockPattern,
  addManyStockPatterns,
  deleteStockPattern,
};
