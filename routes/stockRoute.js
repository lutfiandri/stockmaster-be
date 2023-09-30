const express = require('express');
const router = express.Router();
const controller = require('../controllers/stockController');

router.post('/many', controller.addManyStocks);
router.post('/forecast', controller.doStockForecasting);
router.get('/:id', controller.getStock);
router.get('/', controller.getStocks);

module.exports = router;
