import express from 'express';
import { createDocument } from '../controller/Document.controller.js';

const Router = express.Router();

Router.post('/create', createDocument);

export default Router;