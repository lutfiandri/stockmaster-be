const mongoose = require('mongoose');
const StockPattern = require('../models/stockPattern');

const addStockPattern = async (req, res) => {
  try {
    const newPattern = new StockPattern({
      ...req.body,
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
    const pipeline = [{ $match: {} }];

    if (req.query.questions == 1) {
      pipeline.push({
        $lookup: {
          from: 'questions',
          localField: 'questionIds',
          foreignField: '_id',
          as: 'questions',
        },
      });

      pipeline.push({
        $project: {
          questions: {
            multipleChoice: {
              trueOptionId: 0,
            },
          },
        },
      });

      // sort questions based on questionIds
      pipeline.push({
        $addFields: {
          questions: {
            $arrayToObject: {
              $map: {
                input: '$questions',
                as: 'question',
                in: {
                  k: { $toString: '$$question._id' },
                  v: '$$question',
                },
              },
            },
          },
        },
      });
    }

    const result = await StockPattern.aggregate(pipeline).exec();

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

    const pipeline = [{ $match: { _id: new mongoose.Types.ObjectId(id) } }];

    if (req.query.questions == 1) {
      pipeline.push({
        $lookup: {
          from: 'questions',
          localField: 'questionIds',
          foreignField: '_id',
          as: 'questions',
        },
      });

      pipeline.push({
        $project: {
          questions: {
            multipleChoice: {
              trueOptionId: 0,
            },
          },
        },
      });

      // sort questions based on questionIds
      pipeline.push({
        $addFields: {
          questions: {
            $arrayToObject: {
              $map: {
                input: '$questions',
                as: 'question',
                in: {
                  k: { $toString: '$$question._id' },
                  v: '$$question',
                },
              },
            },
          },
        },
      });
    }

    const result = await StockPattern.aggregate(pipeline).exec();

    if (!result?.length) {
      return res.status(404).json({
        success: false,
        message: `stock pattern with id ${id} not found`,
      });
    }

    return res.json({ success: true, data: result[0] });
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
