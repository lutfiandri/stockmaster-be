const express = require('express');
const router = express.Router();
const controller = require('../controllers/leaderBoardController');

router.get('/', controller.getLeaderBoard);

module.exports = router;
