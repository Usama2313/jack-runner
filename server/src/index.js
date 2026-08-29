require('dotenv').config();
const http = require('http');
const express = require('express');
const { Server } = require('socket.io');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const scoresRoutes = require('./routes/scores');
const { setupSocketHandlers } = require('./socket/handlers');

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 3001;

// CORS configuration for local Vite dev and production
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Socket.io initialization
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Attach io to app so routes can access it
app.set('io', io);
setupSocketHandlers(io);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    game: 'Subway Surfers 3D Online',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/scores', scoresRoutes);
const adminRoutes = require('./routes/admin');
app.use('/api/admin', adminRoutes);


// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Server Error]', err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

server.listen(PORT, () => {
  console.log(`=========================================`);
  console.log(` 🚂 SUBWAY SURFERS SERVER RUNNING `);
  console.log(` 🌐 HTTP API: http://localhost:${PORT}/api/health`);
  console.log(` ⚡ WebSocket: ws://localhost:${PORT}`);
  console.log(`=========================================`);
});
