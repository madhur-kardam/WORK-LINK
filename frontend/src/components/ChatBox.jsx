import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { createSocket } from '../services/socket.js';
import { getChatMessages } from '../services/chatService.js';
import './ChatBox.css';

const byTime = (a, b) => new Date(a.createdAt) - new Date(b.createdAt);

// Live chat for ONE application (applicationId = MongoDB _id of the application).
export default function ChatBox({ applicationId }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const [connected, setConnected] = useState(false);
  const socketRef = useRef(null);
  const bodyRef = useRef(null);

  // Add messages without duplicates (history + live can overlap)
  const addMessages = (incoming) =>
    setMessages((prev) => {
      const seen = new Set(prev.map((m) => m._id));
      const fresh = incoming.filter((m) => !seen.has(m._id));
      return fresh.length ? [...prev, ...fresh].sort(byTime) : prev;
    });

  useEffect(() => {
    let active = true;
    setMessages([]);
    setError('');
    setConnected(false);

    // 1) Load old messages over REST
    getChatMessages(applicationId)
      .then(({ ok, data }) => {
        if (!active) return;
        if (ok) addMessages(data);
        else setError(data.error || 'Failed to load messages');
      })
      .catch(() => active && setError('Network error. Please try again.'));

    // 2) Connect Socket.io and join this application's room
    const socket = createSocket();
    socketRef.current = socket;

    socket.on('connect', () => {
      socket.emit('join_chat', applicationId, (res) => {
        if (!active) return;
        if (res.ok) {
          setConnected(true);
          setError('');
        } else {
          setError(res.error);
        }
      });
    });
    socket.on('disconnect', () => active && setConnected(false));
    socket.on('connect_error', () => active && setError('Could not connect to chat. Retrying...'));

    // 3) Live messages pushed by the server
    socket.on('new_message', (msg) => {
      if (active && msg.applicationId === applicationId) addMessages([msg]);
    });

    return () => {
      active = false;
      socket.emit('leave_chat', applicationId);
      socket.disconnect();
    };
  }, [applicationId]);

  // Keep the chat scrolled to the latest message
  useEffect(() => {
    const el = bodyRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || !connected) return;

    socketRef.current.emit('send_message', { applicationId, text: trimmed }, (res) => {
      if (!res.ok) setError(res.error);
    });
    setText('');
  };

  return (
    <div className="cb">
      <div className="cb-status">{connected ? '🟢 Connected' : '🟡 Connecting...'}</div>
      {error && <div className="cb-error">{error}</div>}

      <div className="cb-body" ref={bodyRef}>
        {messages.length === 0 ? (
          <p className="cb-empty">No messages yet. Say hello!</p>
        ) : (
          messages.map((m) => (
            <div className={`cb-message ${m.senderId === user.id ? 'mine' : 'theirs'}`} key={m._id}>
              <div className="cb-bubble">{m.text}</div>
              <div className="cb-time">
                {new Date(m.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          ))
        )}
      </div>

      <form className="cb-form" onSubmit={sendMessage}>
        <input
          type="text"
          placeholder="Type a message..."
          maxLength={1000}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button type="submit" className="cb-send" disabled={!connected}>Send</button>
      </form>
    </div>
  );
}