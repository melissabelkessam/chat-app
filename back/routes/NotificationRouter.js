const express = require('express');
const { pushNotification } = require('../controllers/NotifController');
const authenticate = require('../middlewares/auth');

const router = express.Router();

router.post('/', authenticate, pushNotification);

module.exports = router;