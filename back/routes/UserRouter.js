const express = require('express');
const { registerUser, loginUser, getUserProfile, getAllUsers, removeFriend, getFriends, addFriend, getFriendRequests,
respondToFriendRequest} = require('../controllers/UsersController');
const authenticate = require('../middlewares/auth');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/', authenticate, getAllUsers);

router.get('/me', authenticate, getUserProfile);

router.post('/addFriend', authenticate, addFriend)
router.delete('/removeFriend/:friendId', authenticate, removeFriend);
router.get("/friends", authenticate, getFriends);
router.get('/friendRequests', authenticate, getFriendRequests);
router.post('/respondToFriendRequest', authenticate, respondToFriendRequest);

module.exports = router;