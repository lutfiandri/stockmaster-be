const mongoose = require('mongoose');
const Stock = require('../models/stock');
const axios = require('axios');
const getenv = require('../utils/helpers/getenv');

const addManyStocks = async (req, res) => {
  try {
    if (!req.body.stocks) {
      return res.status(400).json({
        success: false,
        message: 'field "stocks" is required',
      });
    }

    const stocks = [];
    const errs = [];

    req.body.stocks.forEach((s) => {
      const question = new Stock({
        ...s,
      });
      stocks.push(question);

      const err = question.validateSync();
      if (err) {
        err.id = question.id;
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

    const result = await Stock.insertMany(stocks);

    return res.json({ success: true, data: result, count: stocks.length });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const BE_ML_BASEURL = getenv('BE_ML_BASEURL');

const doStockForecasting = async (req, res) => {
  try {
    const stocks = await Stock.find();

    const promises = stocks.map(async (stock) => {
      // const mlResult = await axios.post(`${BE_ML_BASEURL}/stock-updates`, { // vercel error (too large) -> get from local
      const mlResult = await axios.post(`http://127.0.0.1:5001/stock-updates`, {
        symbol: stock.symbol,
      });

      // console.log(mlResult.data);

      const forecasts = mlResult.data.forecast.map((f) => {
        return {
          timestamp: f.timestamp,
          forecast: f.forecast,
        };
      });

      const prices = mlResult.data.real.map((r) => {
        return {
          timestamp: r.timestamp,
          close: r.close,
          seasonal: r.seasonal,
          trend: r.trend,
          residual: r.residual,
          volume: r.volume,
        };
      });

      stock.prices = prices;
      stock.forecasts = forecasts;

      return await stock.save();
    });

    const results = await Promise.all(promises);

    return res.json({ success: true, data: results });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getStocks = async (req, res) => {
  try {
    const result = await Stock.find();
    return res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getStock = async (req, res) => {
  try {
    const { id } = req.params;

    const validObjectId = mongoose.Types.ObjectId.isValid(id);
    const orFilters = [];

    if (validObjectId) {
      orFilters.push({ _id: id });
    } else {
      orFilters.push({ symbol: id });
    }

    const result = await Stock.findOne({
      $or: orFilters,
    });
    if (!result) {
      return res.status(404).json({
        success: false,
        message: `stock ${id} not found`,
      });
    }

    return res.json({ success: true, data: result });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  addManyStocks,
  doStockForecasting,
  getStock,
  getStocks,
};
