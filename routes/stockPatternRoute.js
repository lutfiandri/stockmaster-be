const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/authMiddleware');
const controller = require('../controllers/stockPatternController');
const learnQuizController = require('../controllers/learnQuizController');

router.post('/', controller.addStockPattern);
router.post('/many', controller.addManyStockPatterns);
router.get('/', controller.getStockPatterns);
router.get('/:id', controller.getStockPattern);
router.delete('/:id', controller.deleteStockPattern);

// answering questions
router.post(
  '/:patternId/attempts/start',
  authenticate(),
  learnQuizController.createAttempt
);

router.get(
  '/:patternId/attempts/last',
  authenticate(),
  learnQuizController.getLastAttempt
);

router.post(
  '/:patternId/attempts/:questionId',
  authenticate(),
  learnQuizController.answerQuestion
);

module.exports = router;
