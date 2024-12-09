import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import '../index.css'; 

const Login = () => {
    const { login } = useAuth();
    const [form, setForm] = useState({ username: '', password: '' });

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = (e) => {
        e.preventDefault();
        login(form.username, form.password);
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h2 className="login-title">Login</h2>
                <p className="login-subtitle">Please enter your login details to continue</p>
                <form onSubmit={handleSubmit} className="login-form">
                    <div className="input-group">
                        <input
                            type="text"
                            name="username"
                            placeholder="Username"
                            value={form.username}
                            onChange={handleChange}
                            required
                            className="login-input"
                        />
                    </div>
                    <div className="input-group">
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={form.password}
                            onChange={handleChange}
                            required
                            className="login-input"
                        />
                    </div>
                    <button type="submit" className="login-button">Login</button>
                </form>
            </div>
        </div>
    );
};

export default Login;
