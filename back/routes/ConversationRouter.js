const express = require('express');
const {
    createConversation,
    getConversation,
    updateConversation,
    getConversations,
    createPrivateConversation,
} = require('../controllers/ConversationController');
const authenticate = require('../middlewares/auth');

const router = express.Router();

router.post('/', authenticate, createConversation);
router.get('/:id', authenticate, getConversation);
router.patch('/:id', authenticate, updateConversation);
router.post('/privateConversation', authenticate, createPrivateConversation)
router.get('/', authenticate, getConversations);

module.exports = router;