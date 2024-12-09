import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css';

//import { useAuth } from '../context/AuthContext';

const Home = () => {
    //const { user } = useAuth();

    return (
        <div className="home">
            <h1>Welcome To PingMe</h1>
            <p>Connect with friends and groups in real-time.</p>
            {/*{user ? (*/}
            {/*    <Link to="/chat">Go to Chat</Link>*/}
            {/*) : (*/}
            <Link to="/login">Get Started</Link>
            {/*)}*/}
        </div>
    );
};

export default Home;
