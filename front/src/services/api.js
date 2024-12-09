import axios from 'axios';

const BASE_API_URL = 'http://localhost:4001/api';

/**
 * Fetch messages for a specific conversation.
 * @param {string} conversationId - The ID of the conversation.
 * @returns {Promise<Array>} - A promise resolving to the list of messages.
 */
export const getConversationMessages = async (conversationId) => {
    try {
        const { data } = await axios.get(`${BASE_API_URL}/messages/conversation/${conversationId}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        return data;
    } catch (error) {
        console.error('Error fetching messages:', error.message);
        throw error;
    }
};

/**
 * Send a message to a specific conversation.
 * @param {string} content - The content of the message.
 * @param {string} conversationId - The ID of the conversation.
 * @param {string} authToken - The user's authentication token.
 * @returns {Promise<Object>} - A promise resolving to the sent message.
 */
export const postMessageToConversation = async (content, conversationId, authToken) => {
    try {
        const { data } = await axios.post(
            `${BASE_API_URL}/conversations/${conversationId}/messages`,
            { content },
            {
                headers: { Authorization: `Bearer ${authToken}` },
            }
        );
        return data;
    } catch (error) {
        console.error('Error sending message:', error.message);
        throw error;
    }
};
