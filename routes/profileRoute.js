const express = require('express');
const router = express.Router();
const controller = require('../controllers/profileController');
const { authenticate } = require('../middlewares/authMiddleware');

router.get('/', authenticate(), controller.getCurrentProfile);

module.exports = router;
