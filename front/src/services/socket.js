import { io } from 'socket.io-client';

const SERVER_ENDPOINT = 'http://localhost:4001';

/**
 * Establish a WebSocket connection to the server.
 * @type {Socket}
 */
export const socket = io(SERVER_ENDPOINT, {
    transports: ['websocket'], // Use WebSocket for real-time communication
    withCredentials: true, // Include credentials for cross-origin requests
});
