const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],
    isGroup: { type: Boolean, default: false, required: true },
    name: { type: String },
    bannedWords: { type: [String], default: [] },
    admins: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }],
});

const Conversation = mongoose.model('Conversation', conversationSchema);

module.exports = Conversation;