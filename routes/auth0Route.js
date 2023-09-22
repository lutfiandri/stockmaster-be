const express = require('express');
const router = express.Router();
const controller = require('../controllers/auth0Controller');

router.post('/post-user-registration', controller.upsertUser);

module.exports = router;
