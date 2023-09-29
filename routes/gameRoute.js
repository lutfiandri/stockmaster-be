const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/authMiddleware');
const controller = require('../controllers/gameController');
const gameQuizController = require('../controllers/gameQuizController');

router.post('/', controller.addGame);
router.get('/last', authenticate(), controller.getLastGame);
router.get('/', authenticate(), controller.getGames);
router.get('/:id', authenticate(), controller.getGame);
router.delete('/:id', controller.deleteGame);

// answering questions
router.post(
  '/:gameId/attempts',
  authenticate(),
  gameQuizController.createAttempt
);

router.get(
  '/:gameId/attempts/last',
  authenticate(),
  gameQuizController.getLastAttempt
);

router.post(
  '/:gameId/attempts/:attemptId/questions/:questionId',
  authenticate(),
  gameQuizController.answerQuestion
);

router.post(
  '/:gameId/attempts/:attemptId/end',
  authenticate(),
  gameQuizController.endAttempt
);

module.exports = router;
