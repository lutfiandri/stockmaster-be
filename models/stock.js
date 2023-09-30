const mongoose = require('mongoose');

const priceSchema = new mongoose.Schema(
  {
    timestamp: Date,
    close: Number,
    seasonal: Number,
    trend: Number,
    residual: Number,
    volume: Number,
  },
  { _id: false }
);

const forecastSchema = new mongoose.Schema(
  {
    timestamp: Date,
    forecast: Number,
  },
  { _id: false }
);

const stockSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    symbol: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
    },
    prices: [priceSchema],
    forecasts: [forecastSchema],
  },
  { timestamps: true }
);

const Stock = mongoose.model('Stock', stockSchema);

module.exports = Stock;
