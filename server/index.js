import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import DocumentManager from './DocumentManager.js';
import DocumentRouter from './Route/Document.route.js';
import authRouter from './Route/AuthRouter.js';

dotenv.config();

// Initialize the app
const app = express();
app.use(express.json());

// Define allowed origins
const allowedOrigins = ['https://text-editor-phi-ashen.vercel.app', 'http://localhost:5173'];

// Configure CORS to allow specific origins
app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }

  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// Enable CORS for preflight (OPTIONS) requests
app.options('*', cors({
  origin: allowedOrigins,
  credentials: true,
}));

// Define routes
app.use('/api/document/', DocumentRouter);
app.use('/api/auth/', authRouter);

// Set up Socket.io server with CORS configuration
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  }
});

// Document manager instance
const Documents = new DocumentManager();

// Socket.io connection
io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('new-document', async (data) => {
    const res = await Documents.createDocument(data);
    socket.emit("serverResponse", res);
  });

  socket.on('update-document', (data) => {
    const res = Documents.updateDocument(data);
    socket.emit("serverResponse", res);
  });

  socket.on('delete-document', (data) => {
    const res = Documents.deleteDocument(data);
    socket.emit("serverResponse", res);
  });

  socket.on('add-collaborator', (data) => {
    const res = Documents.addCollaborator(data);
    socket.emit("serverResponse", res);
  });

  socket.on('join-document', (docId) => {
    socket.join(docId);
    console.log(`User ${socket.id} joined document ${docId}`);
  });

  socket.on('send-changes', (docId, delta) => {
    socket.to(docId).emit('receive-changes', delta);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Start the server
const port = process.env.PORT || 3001;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
