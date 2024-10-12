import express from "express";
import { googleLogin } from "../controller/Auth.controller.js";

const authRouter = express.Router();


authRouter.post('/google-login', googleLogin);
// authRouter.post('/logout', logout);

export default authRouter;