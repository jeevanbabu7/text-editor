import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors'; // Import CORS
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { create } from 'domain';
import DocumentManager from './DocumentManager.js';
import DocumentRouter from './Route/Document.route.js';
dotenv.config();

// app initialization
const app = express();
app.use('api/document/', DocumentRouter);
app.use(cors({
  origin: 'http://localhost:5173', 
  methods: ['GET', 'POST'],
}));

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173', 
    methods: ['GET', 'POST']
  }
});

// document Manager

const Documents = new DocumentManager();

// Socket.io connection

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('new-document', (data) => {
    const res = Documents.createDocument(data);
  });

  socket.on('update-document', (data) => {
    const res = Documents.updateDocument(data);
  });

  socket.on('delete-document', (data) => {
    const res = Documents.deleteDocument(data);
  });

  socket.on('send-changes', (delta) => {
    socket.broadcast.emit('receive-changes', delta);
    console.log('Received delta:', delta);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});


//------------------------------
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

//-----------------------------------


server.listen(3001, () => {
  console.log('Server is running on port 3001');
});
