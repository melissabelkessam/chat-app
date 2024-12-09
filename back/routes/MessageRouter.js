const express = require('express');
const { createMessage, getMessages } = require('../controllers/MessageController');
const authenticate = require('../middlewares/auth');
const preventSpam = require('../middlewares/AntiSpam');

const router = express.Router();

router.get('/:conversationId/messages', authenticate, getMessages);
router.post('/:conversationId/messages', authenticate, preventSpam, createMessage);

module.exports = router;