const express = require('express');
const router = express.Router();
const controller = require('../controllers/stockPatternController');

router.post('/', controller.addStockPattern);
router.get('/', controller.getStockPatterns);
router.get('/:id', controller.getStockPattern);
router.delete('/:id', controller.deleteStockPattern);

module.exports = router;
