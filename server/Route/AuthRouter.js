import express from "express";
import { googleLogin, signup, login } from "../controller/Auth.controller.js";


const authRouter = express.Router();


authRouter.post('/google-login', googleLogin);
authRouter.post('/signup', signup);
authRouter.post('/login', login);
// authRouter.post('/logout', logout);

export default authRouter;