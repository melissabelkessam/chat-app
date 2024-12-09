const express = require('express');
const http = require('http');
const {Server} = require('socket.io');
const port = 4001;
const connectDB = require('./config/db');
const cors = require("cors");
const bodyParser = require("body-parser");
const userRouter = require("./routes/UserRouter");
const conversationRouter = require("./routes/ConversationRouter");
const messageRouter = require("./routes/MessageRouter");
const notificationRouter = require("./routes/NotificationRouter");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST", "PUT"],
    },
});

app.use((req, res, next) => {
    req.io = io;
    next();
});

app.use(cors());
app.use(bodyParser.json());

app.use('/api/users', userRouter);
app.use('/api/conversations', conversationRouter);
app.use('/api/messages', messageRouter);
app.use('/api/notifications', notificationRouter);

io.on('connection', (socket) => {
    console.log('User connected: ', socket.id);
    socket.on('typing', (data) => {
        io.to(data.conversationId).emit(`displayTyping`, {user: data.user});
    });

    socket.on('stopTyping', (data) => {
        io.to(data.conversationId).emit('removeTyping', {user: data.user});
    });

    socket.on('joinConversation', (conversationId) => {
        socket.join(conversationId);
        console.log(`User ${socket.id} joined conversation ${conversationId}`);
    });

    socket.on('leaveConversation', (conversationId) => {
        socket.leave(conversationId);
        console.log(`User ${socket.id} left conversation ${conversationId}`);
    });
});

app.use((req, res, next) => {
    console.log(`Incoming request: ${req.method} ${req.originalUrl}`);
    next();
});

app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({ error: err.message });
});

connectDB();
server.listen(port, () => console.log(`Server running on port ${port}`));