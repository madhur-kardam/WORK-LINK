const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const { getJwtSecret } = require('../config/jwt');
const chatService = require('../services/chatService');
const HttpError = require('../services/httpError');

const room = (applicationId) => `chat:${applicationId}`;
const errorText = (error) => (error instanceof HttpError ? error.message : 'Server error');

const initSocket = (httpServer) => {
  const io = new Server(httpServer, {
  cors: {
    origin: 'https://work-link-frontend.onrender.com',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

  // 1) Authenticate every connection with the same JWT used by the REST API
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error('Authentication error'));

    try {
      socket.user = jwt.verify(token, getJwtSecret()); // { userId, email, userType }
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    // 2) Join the room of one application's chat (only if allowed)
    socket.on('join_chat', async (applicationId, ack) => {
      try {
        await chatService.checkAccess(applicationId, socket.user.userId);
        socket.join(room(applicationId));
        ack?.({ ok: true });
      } catch (error) {
        ack?.({ ok: false, error: errorText(error) });
      }
    });

    // 3) Save the message, then push it to everyone in the room (both users)
    socket.on('send_message', async ({ applicationId, text } = {}, ack) => {
      try {
        const message = await chatService.saveMessage(applicationId, socket.user.userId, text);
        io.to(room(applicationId)).emit('new_message', message);
        ack?.({ ok: true });
      } catch (error) {
        ack?.({ ok: false, error: errorText(error) });
      }
    });

    socket.on('leave_chat', (applicationId) => {
      socket.leave(room(applicationId));
    });
  });

  return io;
};

module.exports = initSocket;