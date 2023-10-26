import express from 'express';
import { findOrCreateUserByEmail, getUserByEmail, verifyEmail } from '../controllers/userController.js';
const userRouter = express.Router();

userRouter.post('/signup', findOrCreateUserByEmail);
userRouter.get('/:email', getUserByEmail);
userRouter.post('/verifyEmail', verifyEmail);

export default userRouter;