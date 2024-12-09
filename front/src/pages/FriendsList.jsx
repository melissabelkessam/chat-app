import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {useAuth} from "../context/AuthContext";

const FriendList = () => {
    const { user } = useAuth();
    const [friends, setFriends] = useState([]);
    const [newFriend, setNewFriend] = useState('');
    const [friendRequests, setFriendRequests] = useState([]);
    const [showAddFriendForm, setShowAddFriendForm] = useState(false);
    const [notification, setNotification] = useState(null);

    const fetchFriends = async () => {
        try {
            const response = await axios.get('http://localhost:4001/api/users/friends', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setFriends(response.data);
        } catch (error) {
            console.error('Error fetching friends:', error);
        }
    };

    // Fetch friends list
    useEffect(() => {
        if (user) {
            fetchFriends(); // Fetch friends only if user is logged in
        }
        fetchFriendRequests();

    }, [user]);

    const sendFriendRequest = async () => {
        if (!newFriend.trim()) return;

        try {
            const response = await axios.post(
                'http://localhost:4001/api/users/addFriend',
                { friendUsername: newFriend },
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );
            setNewFriend('');
            alert(response.data.message); // Notify user of successful request
        } catch (error) {
            console.error('Error sending friend request:', error);
            alert('Error sending friend request');
        }
    };

    const fetchFriendRequests = async () => {
        try {
            const response = await axios.get('http://localhost:4001/api/users/friendRequests', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            setFriendRequests(response.data); // Assuming you have state to manage requests
        } catch (error) {
            console.error('Error fetching friend requests:', error);
        }
    };

    const handleRemoveFriend = async (friendId) => {
        try {
            await axios.delete(`http://localhost:4001/api/users/removeFriend/${friendId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            // Re-fetch the friends list after removal
            const response = await axios.get('http://localhost:4001/api/users/friends', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            setFriends(response.data);
        } catch (error) {
            console.error('Error removing friend:', error);
        }
    };

    const respondToFriendRequest = async (senderId, action) => {
        try {
            const response = await axios.post(
                'http://localhost:4001/api/users/respondToFriendRequest',
                { senderId, action },
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );
            alert(response.data.message); // Notify user of response
            fetchFriendRequests(); // Refresh friend requests
            if (action === 'accept') fetchFriends(); // Refresh friends list if accepted
        } catch (error) {
            console.error('Error responding to friend request:', error);
        }
    };

    return (
        <div>
            <h3>Your Friends</h3>
            {friends.length === 0 ? (
                <div>
                    <p>No friends found</p>
                    {!showAddFriendForm && (
                        <button onClick={() => setShowAddFriendForm(true)}>Add Friend</button>
                    )}
                </div>
            ) : (
                <div>
                    <ul>
                        {friends.map((friend) => (
                            <li key={friend._id}>
                                {friend.username}
                                <button onClick={() => handleRemoveFriend(friend._id)}>Remove</button>
                            </li>
                        ))}
                    </ul>
                    {!showAddFriendForm && (
                        <button onClick={() => setShowAddFriendForm(true)}>Add Friend</button>
                    )}
                </div>
            )}

            {/* Add New Friend Form */}
            {showAddFriendForm && (
                <div>
                    <h2>Add Friend</h2>
                    <input
                        type="text"
                        value={newFriend}
                        onChange={(e) => setNewFriend(e.target.value)}
                        placeholder="Enter username"
                    />
                    <button onClick={sendFriendRequest}>Send Friend Request</button>
                    <button onClick={() => setShowAddFriendForm(false)}>Cancel</button>
                </div>
            )}

            {/* Notification */}
            {notification && (
                <div className="notification">
                    <p>{notification}</p>
                    <button onClick={() => setNotification(null)}>Dismiss</button>
                </div>
            )}

            {/* Pending Friend Requests */}
            <div>
                <h2>Pending Friend Requests</h2>
                {friendRequests.length === 0 ? (
                    <p>No pending requests</p>
                ) : (
                    <ul>
                        {friendRequests.map((request) => (
                            <li key={request._id}>
                                {request.username}
                                <button onClick={() => respondToFriendRequest(request._id, 'accept')}>
                                    Accept
                                </button>
                                <button onClick={() => respondToFriendRequest(request._id, 'decline')}>
                                    Decline
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default FriendList;