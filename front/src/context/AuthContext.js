import React, { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    const login = async (username, password) => {
        try {
            const { data } = await axios.post('http://localhost:4001/api/users/login', { username, password });
            localStorage.setItem('token', data.token);

            const profile = await axios.get('http://localhost:4001/api/users/me', {
                headers: { Authorization: `Bearer ${data.token}` },
            });

            setUser(profile.data);
            navigate('/chat');
        } catch (err) {
            console.error('Failed to log in:', err.message);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        navigate('/');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
