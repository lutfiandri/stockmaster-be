const mongoose = require('mongoose');
const StockPattern = require('../models/stockPattern');

const addStockPattern = async (req, res) => {
  try {
    const { name, imageUrl, shortDescription } = req.body;
    console.log(req.body);

    const now = new Date();
    const newPattern = new StockPattern({
      name: name,
      imageUrl: imageUrl,
      shortDescription: shortDescription,
      createdAt: now,
      updatedAt: now,
    });

    const err = newPattern.validateSync();
    if (err) {
      return res.status(400).json({
        success: false,
        validationErrors: err.errors,
        message: err.message,
      });
    }

    const result = await newPattern.save();

    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getStockPatterns = async (req, res) => {
  try {
    const result = await StockPattern.find();
    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
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
      res.status(404).json({
        success: false,
        message: `stock pattern with id ${id} not found`,
      });
    }

    res.json({ success: true, data: pattern });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
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
      res.status(404).json({
        success: false,
        message: `stock pattern with id ${id} not found`,
      });
    }

    await StockPattern.deleteOne({ _id: id });

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getStockPatterns,
  addStockPattern,
  deleteStockPattern,
};
