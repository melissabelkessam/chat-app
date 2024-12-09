const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    isOnline: {type: Boolean, required: false},
    friends: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        default: [],
    },
    friendRequests: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Users who sent friend requests
        default: [],
    },
}, {timestamps: true});

const User = mongoose.model('User', userSchema);

module.exports = User;