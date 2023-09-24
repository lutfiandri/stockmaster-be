const mongoose = require('mongoose');
const { question } = require('./question');

const stockPatternSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    descriptions: [String],
    questionIds: [mongoose.Schema.Types.ObjectId],
  },
  { timestamps: true }
);

const StockPattern = mongoose.model('StockPattern', stockPatternSchema);

module.exports = StockPattern;
