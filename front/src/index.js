import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import App from './App';

ReactDOM.render(
    <React.StrictMode>
        <Router>
            <AuthProvider>
                <SocketProvider>
                    <App />
                </SocketProvider>
            </AuthProvider>
        </Router>
    </React.StrictMode>,
    document.getElementById('root')
);