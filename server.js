const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 3000;

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Serve home page
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "home.html"));
});

// Serve admin page
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// Store connected clients
const clients = new Map();

// Middleware para logar todas as requisições e seus dados
app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    const sessionId = req.headers['x-session-id'] || 'unknown';
    const logData = {
        sessionId,
        timestamp,
        method: req.method,
        url: req.url,
        data: req.method === 'POST' ? req.body : null
    };
    
    console.log('Request:', logData);
    
    io.to('admin').emit('userAction', {
        sessionId,
        timestamp,
        page: req.url,
        action: req.method,
        data: req.method === 'POST' ? req.body : null
    });
    
    next();
});

io.on('connection', (socket) => {
    console.log('New client connected');
    updateUserCount();

    socket.on('joinAdmin', () => {
        socket.join('admin');
        console.log('Admin joined');
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
        updateUserCount();
    });
});

function updateUserCount() {
    const count = io.engine.clientsCount;
    io.to('admin').emit('userCount', count);
}

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
