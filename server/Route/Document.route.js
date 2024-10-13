import express from 'express';
import { createDocument, 
        updateDocument, 
        getDocument, 
        getDocumentData, 
        deleteDocument, 
        addCollaborator,
        getCollaborators } from '../controller/Document.controller.js';

const Router = express.Router();

Router.get('/getCollaborators/:docId', getCollaborators);

Router.post('/create', createDocument);
Router.put('/update', updateDocument);
Router.get('/getDocument/:documentId', getDocumentData);
Router.get('/get/:userId', getDocument);
Router.delete('/delete/:id', deleteDocument);
Router.put('/addCollaborator', addCollaborator);

export default Router;