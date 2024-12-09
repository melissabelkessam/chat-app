import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Navbar.css'; 

const NavigationBar = () => {
    const { user, logout } = useAuth();

    return (
        <header className="navbar">
            <div className="navbar-logo">
                <Link to="/" className="navbar-brand">ConnectApp</Link>
            </div>
            <div className="navbar-menu">
                {user ? (
                    <div className="navbar-authenticated">
                        <span className="navbar-user">Hello, <strong>{user.username}</strong></span>
                        <button onClick={logout} className="navbar-logout">Sign Out</button>
                    </div>
                ) : (
                    <div className="navbar-guest">
                        <Link to="/login" className="navbar-link">Sign In</Link>
                        <Link to="/register" className="navbar-link navbar-signup">Sign Up</Link>
                    </div>
                )}
            </div>
        </header>
    );
};

export default NavigationBar;
