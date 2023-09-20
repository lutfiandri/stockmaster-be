const mongoose = require('mongoose');

const stockPatternSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    shortDescription: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const StockPattern = mongoose.model('StockPattern', stockPatternSchema);

module.exports = StockPattern;
