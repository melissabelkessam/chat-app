import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import ChatBox from '../components/ChatBox';
import axios from 'axios';
import FriendList from "./FriendsList";

const ChatPage = () => {
    const { user } = useAuth();
    const socket = useSocket();
    const [conversations, setConversations] = useState([]);
    const [users, setAvailableUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [activeConversation, setActiveConversation] = useState(null);
    const [newChatName, setNewChatName] = useState('');
    const [newChatParticipants, setNewChatParticipants] = useState([]);
    const [showCreateChat, setShowCreateChat] = useState(false);
    const [bannedWords, setBannedWords] = useState('');
    const [setSelectedFriend] = useState(null);
    const [isFriendListVisible, setIsFriendListVisible] = useState(false);
    const [friends] = useState([]);

    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const token = localStorage.getItem('token'); // Retrieve token from localStorage
                if (!token) {
                    console.error('No token found in localStorage');
                    throw new Error('User is not authenticated');
                }

                // Make API request with Authorization header
                const res = await axios.get('http://localhost:4001/api/conversations', {
                    headers: { Authorization: `Bearer ${token}` }, // Include token in headers
                });

                setConversations(res.data); // Update state with fetched conversations
            } catch (error) {
                console.error('Error fetching conversations:', error.response?.data || error.message);
            }
        };

        const fetchUsers = async () => {
            const token = localStorage.getItem('token'); // Retrieve token from localStorage
            if (!token) {
                console.error('No token found in localStorage');
                throw new Error('User is not authenticated');
            }
            const res = await axios.get('http://localhost:4001/api/users', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            // Filter out the current user
            const filteredUsers = res.data.filter((u) => u._id !== user._id);
            setAvailableUsers(filteredUsers);
        }

        if (showCreateChat && user?._id) {
            fetchUsers();
        }
        fetchConversations(); // Fetch conversations on component mount
        socket.on('newNotification', (data) => {
            alert(`${data.user} sent you a message: "${data.message}"`);
        });

        return () => socket.off('newNotification');
    }, [showCreateChat, user?._id, socket]);

    const handleSelectConversation = (conversationId) => {
        setActiveConversation(conversationId);
        socket.emit('joinRoom', conversationId);
    };

    // Handle user selection for participants
    const handleUserSelection = (userId) => {
        if (!newChatParticipants.includes(userId)) {
            setNewChatParticipants((prev) => [...prev, userId]);
        }
    };

    // Handle removal of participants from the selection list
    const handleRemoveParticipant = (userId) => {
        setNewChatParticipants((prev) =>
            prev.filter((participant) => participant !== userId)
        );
    };

    const handleCreateChat = async () => {
        console.log('Create chat button clicked');  // Debugging line

        if (!newChatName.trim()) {
            alert('Please enter a chat name!');
            return;
        }

        if (newChatParticipants.length === 0) {
            alert('Please select at least one participant!');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('Token is missing!');
                return;
            }

            // Debugging: log the chat name and participants before sending
            console.log('Creating chat with:', {
                name: newChatName,
                participantIds: newChatParticipants,
                isGroup: true
            });

            // Send the request to create the chat
            const res = await axios.post(
                'http://localhost:4001/api/conversations',
                { name: newChatName, participantIds: newChatParticipants, isGroup: true, bannedWords: bannedWords.split(',').map(word => word.trim()), },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // Debugging: log response from the server
            console.log('Response from server:', res.data);

            // Update conversation list with the new conversation
            setConversations((prev) => [...prev, res.data]);

            // Reset modal and input fields
            setShowCreateChat(false);
            setNewChatName('');
            setNewChatParticipants([]);
        } catch (error) {
            console.error('Error creating chat:', error);
        }
    };

    const handleFriendSelect = (friend) => {
        setSelectedFriend(friend);
        setIsFriendListVisible(false); // Hide friend list once a friend is selected
    };

    return (
        <div className="chat-page">
            <aside className="sidebar">
                <div className="header">
                    <h3>Your Conversations</h3>
                    {/* Button for accessing Friend List */}
                    <button
                        className="friend-list-btn"
                        onClick={() => setIsFriendListVisible(!isFriendListVisible)}
                    >
                        {isFriendListVisible ? 'Hide Friend List' : 'Show Friend List'}
                    </button>
                </div>
                <ul>
                    {conversations.map((conv) => (
                        <li key={conv._id} onClick={() => handleSelectConversation(conv._id)}>
                            {conv.isGroup ? conv.name : 'Private Chat'}
                        </li>
                    ))}
                </ul>
                {/* Modal for creating a new chat */}
                {showCreateChat && (
                    <div className="modal">
                        <h3>Create a New Chat</h3>

                        {/* Chat Name Input */}
                        <input
                            type="text"
                            placeholder="Chat Name"
                            value={newChatName}
                            onChange={(e) => setNewChatName(e.target.value)}
                        />

                        {/* Search Input for Participants */}
                        <h4>Select Participants</h4>
                        <input
                            type="text"
                            placeholder="Search for participants"
                            onChange={(e) => {
                                const searchTerm = e.target.value.toLowerCase();
                                const filtered = users.filter((user) =>
                                    user.username.toLowerCase().includes(searchTerm)
                                );
                                setFilteredUsers(filtered);
                            }}
                        />

                        <h5>Select banned words</h5>
                        <input
                            type="text"
                            value={bannedWords}
                            onChange={(e) => setBannedWords(e.target.value)}
                            placeholder="Forbidden words (comma-separated)"
                        />

                        {/* Dropdown for participants */}
                        <div className="participants-dropdown">
                            {filteredUsers.map((user) => (
                                <div
                                    key={user._id}
                                    className="participant-option"
                                    onClick={() => handleUserSelection(user._id)}
                                >
                                    {user.username}
                                </div>
                            ))}
                        </div>

                        {/* Display selected participants */}
                        <div className="selected-participants">
                            <h5>Selected Participants:</h5>
                            <ul>
                                {newChatParticipants.map((participantId) => {
                                    const participant = users.find(
                                        (user) => user._id === participantId
                                    );
                                    return (
                                        <li key={participantId}>
                                            {participant ? participant.username : 'Unknown User'}
                                            <button
                                                onClick={() => handleRemoveParticipant(participantId)}
                                            >
                                                Remove
                                            </button>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>

                        {/* Create and Cancel buttons */}
                        <button onClick={handleCreateChat}>Create</button>
                        <button onClick={() => setShowCreateChat(false)}>Cancel</button>
                    </div>
                )}
                <button
                    className="create-chat-btn"
                    onClick={() => setShowCreateChat(true)}
                >
                    Create New Chat
                </button>
            </aside>
            {isFriendListVisible && <FriendList friends={friends} onFriendSelect={handleFriendSelect}/>}
            <main className="chat-area">
                {activeConversation ? (
                    <ChatBox conversationId={activeConversation} user={user} />
                ) : (
                    <p>Select a conversation to start chatting!</p>
                )}
            </main>
        </div>
    );
};

export default ChatPage;
