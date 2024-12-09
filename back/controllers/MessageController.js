const Message = require('../models/MessageModel');

const getMessages = async (req, res) => {
    try {
        const { conversationId } = req.params;
        const messages = await Message.find({ conversation: conversationId })
            .populate('sender', 'username')
            .sort({ createdAt: 1 });
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createMessage = async (req, res) => {
    const { content } = req.body;
    const { conversationId } = req.params;

    try {
        console.log(`conversation : ${conversationId[2]} blablabla`);
        const newMessage = new Message({
            content,
            sender: req.user._id, // Derive sender from authenticated user
            conversation: conversationId,
        });

        await newMessage.save();

        // Emit the new message to all clients in the conversation room
        const populatedMessage = await newMessage.populate('sender', 'username');
        req.io.to(conversationId).emit('newMessage', populatedMessage);

        res.status(201).json(populatedMessage);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to send message' });
    }
};

module.exports = { getMessages, createMessage };
