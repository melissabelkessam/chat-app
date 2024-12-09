import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ChatPage from './pages/ChatPage';
import './styles/app.css';
import './index.css';

const App = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div className="loading">Chargement...</div>;
    }

    return (
        <div className="app-container">
            <Navbar />
            <main className="main-content">

            <Routes>
                <Route path="/" element={user ? <Home /> : <Navigate to="/login" />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/chat" element={user ? <ChatPage /> : <Navigate to="/login" />} />
            </Routes>
            </main>
        </div>
    );
};

export default App;
