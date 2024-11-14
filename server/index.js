import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors'; // Import CORS
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import DocumentManager from './DocumentManager.js';
import DocumentRouter from './Route/Document.route.js';
import authRouter from './Route/AuthRouter.js';
// import cookieParser from 'cookie-parser';
dotenv.config();

// app initialization
const app = express();
app.use(express.json());
app.use(cors({
  origin: 'https://text-editor-phi-ashen.vercel.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://text-editor-phi-ashen.vercel.app');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.options('*', cors()); // Enable CORS for all preflight (OPTIONS) requests

// app.use(cookieParser()) 

app.use('/api/document/', DocumentRouter);
app.use('/api/auth/', authRouter);


const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'https://text-editor-phi-ashen.vercel.app', 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  }
});

// document Manager

const Documents = new DocumentManager();

// Socket.io connection

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('new-document', async (data) => {
    const res = await Documents.createDocument(data);
    socket.emit("serverResponse",res);

  });

  socket.on('update-document', (data) => {
    const res = Documents.updateDocument(data);
    socket.emit("serverResponse",res);
  });

  socket.on('delete-document', (data) => {
    const res = Documents.deleteDocument(data);
    socket.emit("serverResponse",res);
  });

  // socket.on('send-changes', (delta) => {
  //   socket.broadcast.emit('receive-changes', delta);
  //   console.log('Received delta:', delta);
  // });

  socket.on('add-collaborator', (data) => {
    const res = Documents.addCollaborator(data);
    socket.emit("serverResponse",res);
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


//------------------------------
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

//-----------------------------------

const port = process.env.PORT || 3001;
server.listen(port, () => {
  console.log('Server is running on port 3001');
});
