import React, { useState } from 'react';
import axios from 'axios';
import '../styles/Register.css';

const Register = () => {
    const [form, setForm] = useState({ username: '', password: '' });
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:4001/api/users/register', form);
            setSuccess(true);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="register-container">
            <div className="register-card">
                {success ? (
                    <div className="success-message">
                        <h2 className="register-title">Registration Successful!</h2>
                        <p>
                            You can now <a href="/login" className="login-link">Login here</a>.
                        </p>
                    </div>
                ) : (
                    <>
                        <h2 className="register-title">Create an Account</h2>
                        <p className="register-subtitle">Join us and start your journey!</p>
                        <form onSubmit={handleSubmit} className="register-form">
                            <div className="input-group">
                                <input
                                    type="text"
                                    name="username"
                                    placeholder="Username"
                                    value={form.username}
                                    onChange={handleChange}
                                    required
                                    className="register-input"
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
                                    className="register-input"
                                />
                            </div>
                            <button type="submit" className="register-button">Register</button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
};

export default Register;
