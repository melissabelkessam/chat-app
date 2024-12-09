const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/UserModel');

const registerUser = async (req, res) => {
    const { username, password } = req.body;

    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ error: 'Username already exists' });
        }

        // Hash password and save user
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const loginUser = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        console.log(user);
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('username'); // Select only the username field
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
}

const addFriend = async (req, res) => {
    try {
        const userId = req.user._id;
        const { friendUsername } = req.body;

        // Find the friend by username
        const friend = await User.findOne({ username: friendUsername });

        if (!friend) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (friend.friendRequests.includes(userId)) {
            return res.status(400).json({ message: 'Friend request already sent' });
        }

        if (friend.friends.includes(userId)) {
            return res.status(400).json({ message: 'User is already your friend' });
        }

        // Add the friend request to the receiver's list
        friend.friendRequests.push(userId);
        await friend.save();

        res.status(200).json({ message: 'Friend request sent successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error adding friend' });
    }
}

const getFriendRequests = async (req, res) => {
    try {
        const userId = req.user._id;

        const user = await User.findById(userId).populate('friendRequests', 'username');
        res.status(200).json(user.friendRequests);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching friend requests' });
    }
};

const removeFriend = async (req, res) => {
    try {
        const userId = req.user._id;
        const { friendId } = req.params;

        console.log(`friend : ${friendId}`)

        const user = await User.findById(userId);
        const friend = await User.findById(friendId);

        console.log(friend);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        else if (!friend) {
            return res.status(404).json({ message: 'Friend not found' });
        }

        user.friends = user.friends.filter(id => id.toString() !== friendId);
        friend.friends = friend.friends.filter(id => id.toString() !== userId);

        await user.save();
        await friend.save();

        res.status(200).json({ message: 'Friend removed successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error removing friend' });
    }
}

const getFriends = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId).populate('friends', 'username');
        res.status(200).json(user.friends);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching friends' });
    }
}

const respondToFriendRequest = async (req, res) => {
    try {
        const userId = req.user._id;
        const { senderId, action } = req.body; // `action` can be "accept" or "decline"

        const user = await User.findById(userId);
        const sender = await User.findById(senderId);

        if (!user || !sender) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Remove the sender from the receiver's friendRequests
        user.friendRequests = user.friendRequests.filter(
            (requestId) => requestId.toString() !== senderId
        );

        if (action === 'accept') {
            // Add each other as friends
            if (!user.friends.includes(senderId)) user.friends.push(senderId);
            if (!sender.friends.includes(userId)) sender.friends.push(userId);

            await sender.save();
        }

        await user.save();

        res.status(200).json({
            message: action === 'accept' ? 'Friend request accepted' : 'Friend request declined',
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error responding to friend request' });
    }
};

module.exports = { registerUser, loginUser, getUserProfile, getAllUsers, addFriend, removeFriend, getFriends, getFriendRequests,
respondToFriendRequest};