const Conversation = require('../models/ConversationModel');

// Create a new conversation
const createConversation = async (req, res) => {
    const { participantIds, isGroup, name, bannedWords } = req.body;

    try {
        const creatorId = req.user.id;

        const newConversation = new Conversation({
            participants: [...new Set([...participantIds, creatorId])], // Include creator and avoid duplicates
            isGroup,
            name: name,
            bannedWords: bannedWords || [],
            admins: [creatorId], // Creator is an admin
        });
        await newConversation.save();

        res.status(201).json(newConversation);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createPrivateConversation = async (req, res) => {
    const { participantsIds, isGroup } = req.body;

    console.log(participantsIds);

    try {
        const newConversation = new Conversation({
            participants: [...new Set([...participantsIds])],
            isGroup,
        });
        await newConversation.save();

        res.status(201).json(newConversation);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getConversation = async (req, res) => {
    try {
        const conversation = await Conversation.findById(req.params.id)
            .populate('participants', 'username')
            .populate({ path: 'messages', select: 'content sender createdAt' });
        res.json(conversation);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getConversations = async (req, res) => {
    try {
        // Find all conversations where the authenticated user is a participant
        const conversations = await Conversation.find({ participants: req.user.id })
            .populate('participants', 'username') // Populate participant usernames
            .populate('admins', 'username'); // Populate admin usernames

        const groupConversations = [];

        conversations.forEach((conversation) => {
            groupConversations.push(conversation);
        });

        res.json(groupConversations);
    } catch (error) {
        console.error('Error fetching conversations:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

const updateConversation = async (req, res) => {
    try {
        const updatedConversation = await Conversation.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true } // Return the updated document
        );
        res.json(updatedConversation);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { createConversation, getConversation, updateConversation, getConversations, createPrivateConversation };
