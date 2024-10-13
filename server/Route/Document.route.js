import express from 'express';
import { createDocument, updateDocument, getDocument, getDocumentData } from '../controller/Document.controller.js';

const Router = express.Router();

Router.post('/create', createDocument);
Router.put('/update', updateDocument);
Router.get('/getDocument/:documentId', getDocumentData);
Router.get('/get/:userId', getDocument);

export default Router;