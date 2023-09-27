const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/authMiddleware');
const controller = require('../controllers/stockPatternController');
const learnQuizController = require('../controllers/learnQuizController');

router.post('/', controller.addStockPattern);
router.post('/many', controller.addManyStockPatterns);
router.get('/', authenticate(), controller.getStockPatterns);
router.get('/:id', authenticate(), controller.getStockPattern);
router.delete('/:id', controller.deleteStockPattern);

// answering questions
router.post(
  '/:patternId/attempts',
  authenticate(),
  learnQuizController.createAttempt
);

router.get(
  '/:patternId/attempts/last',
  authenticate(),
  learnQuizController.getLastAttempt
);

router.post(
  '/:patternId/attempts/:attemptId/questions/:questionId',
  authenticate(),
  learnQuizController.answerQuestion
);

router.post(
  '/:patternId/attempts/:attemptId/end',
  authenticate(),
  learnQuizController.endAttempt
);

module.exports = router;
