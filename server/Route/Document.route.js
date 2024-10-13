import express from 'express';
import { createDocument, updateDocument, getDocument, getDocumentData, deleteDocument } from '../controller/Document.controller.js';

const Router = express.Router();

Router.post('/create', createDocument);
Router.put('/update', updateDocument);
Router.get('/getDocument/:documentId', getDocumentData);
Router.get('/get/:userId', getDocument);
Router.delete('/delete/:id', deleteDocument);

export default Router;