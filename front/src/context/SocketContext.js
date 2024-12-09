import React, { createContext, useContext, useEffect, useState } from 'react';
import { socket } from '../services/socket';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const onConnect = () => setIsConnected(true);
        const onDisconnect = () => setIsConnected(false);

        socket.on('connect', onConnect);
        socket.on('disconnect', onDisconnect);

        return () => {
            socket.off('connect', onConnect);
            socket.off('disconnect', onDisconnect);
        };
    }, []);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => useContext(SocketContext);
