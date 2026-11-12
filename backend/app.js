require('dotenv').config();
const http = require('http');
const cookieParser = require('cookie-parser');
const initSocket = require('./sockets/chatSocket');
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const routes = require('./routes');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: 'https://work-link-frontend.onrender.com/',
  credentials: true
}));
app.use(cookieParser());

// MongoDB Connection
connectDB();

// API Routes
app.use('/api', routes);

// Start server
// HTTP server (shared by Express and Socket.io)
const server = http.createServer(app);
initSocket(server);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});