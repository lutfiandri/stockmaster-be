const express = require('express');
const router = express.Router();
const controller = require('../controllers/questionController');

router.post('/', controller.addQuestion);
router.get('/', controller.getQuestions);
router.get('/:id', controller.getQuestion);
router.delete('/:id', controller.deleteQuestion);

module.exports = router;
