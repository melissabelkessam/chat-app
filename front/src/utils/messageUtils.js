import axios from 'axios';

export const sendMessage = async (conversationId, messageContent, token) => {
    try {
        const res = await axios.post(
            `http://localhost:4001/api/conversations/${conversationId}/messages`,
            { content: messageContent },
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );
        return res.data;
    } catch (error) {
        console.error('Error sending message:', error);
        throw error;
    }
};