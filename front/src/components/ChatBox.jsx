import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { socket } from '../services/socket';
import '../styles/ChatBox.css';

const MessagingBox = ({ currentConversationId, currentUser }) => {
    const [currentMessage, setCurrentMessage] = useState('');
    const [allMessages, setAllMessages] = useState([]);
    const [showTyping, setShowTyping] = useState(false);
    const [activeTypers, setActiveTypers] = useState([]);

    // Fetch messages when the conversation changes
    useEffect(() => {
        const loadMessages = async () => {
            try {
                const { data } = await axios.get(
                    `http://localhost:4001/api/messages/${currentConversationId}/messages`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`,
                        },
                    }
                );
                setAllMessages(data);
            } catch (err) {
                console.error('Unable to fetch messages:', err);
            }
        };

        if (currentConversationId) {
            loadMessages();
        }
    }, [currentConversationId]);

    // Real-time event handling
    useEffect(() => {
        socket.emit('joinRoom', currentConversationId);

        socket.on('incomingMessage', (newMessage) => {
            if (newMessage.conversation === currentConversationId) {
                setAllMessages((prev) => [...prev, newMessage]);
            }
        });

        socket.on('showTyping', ({ typingUser }) => {
            if (typingUser._id !== currentUser._id) {
                setActiveTypers((prevTypers) => {
                    if (!prevTypers.some((user) => user._id === typingUser._id)) {
                        return [...prevTypers, typingUser];
                    }
                    return prevTypers;
                });
            }
        });

        socket.on('hideTyping', ({ typingUser }) => {
            setActiveTypers((prevTypers) =>
                prevTypers.filter((user) => user._id !== typingUser._id)
            );
        });

        return () => {
            socket.emit('leaveRoom', currentConversationId);
            socket.off('incomingMessage');
            socket.off('showTyping');
            socket.off('hideTyping');
        };
    }, [currentConversationId, currentUser._id]);

    // Send message
    const sendMessage = async () => {
        if (!currentMessage.trim()) return;

        try {
            await axios.post(
                `http://localhost:4001/api/messages/${currentConversationId}/messages`,
                { content: currentMessage },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );
            setCurrentMessage('');
            socket.emit('stopTyping', { conversationId: currentConversationId, user: currentUser });
        } catch (err) {
            console.error('Message failed to send:', err);
        }
    };

    const formatTime = (timeStamp) => {
        const date = new Date(timeStamp);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const handleTypingEvent = (e) => {
        setCurrentMessage(e.target.value);

        if (!showTyping) {
            setShowTyping(true);
            socket.emit('userTyping', { conversationId: currentConversationId, user: currentUser });

            setTimeout(() => {
                setShowTyping(false);
                socket.emit('stopTyping', { conversationId: currentConversationId, user: currentUser });
            }, 3000);
        }
    };

    const wrapText = (text, maxWidth = 80) => {
        const regex = new RegExp(`(.{1,${maxWidth}})(\\s+|$)`, 'g');
        return text.match(regex)?.join('\n') || text;
    };

    return (
        <div className="chat-box">
            <div className="message-container">
                {allMessages.map((msg) => (
                    <div
                        key={msg._id}
                        className={`chat-message ${
                            msg.sender._id === currentUser._id ? 'sent-message' : 'received-message'
                        }`}
                    >
                        <div className="message-details">
                            <p className="message-body">
                                <strong>{msg.sender.username}</strong>: {wrapText(msg.content)}
                            </p>
                            <span className="time-stamp">
                                {formatTime(msg.createdAt)}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
            {activeTypers.length > 0 && (
                <div className="typing-indicator">
                    {activeTypers.length === 1
                        ? `${activeTypers[0].username} is typing...`
                        : 'Several participants are typing...'}
                </div>
            )}
            <div className="message-input">
                <input
                    type="text"
                    value={currentMessage}
                    onChange={handleTypingEvent}
                    placeholder="Write something..."
                />
                <button onClick={sendMessage}>Send</button>
            </div>
        </div>
    );
};

export default MessagingBox;
