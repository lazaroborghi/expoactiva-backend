import express from 'express'
import { findOrCreateUserByEmail, getUserByEmail } from '../controllers/userController.js';
const userRouter = express.Router();

userRouter.post('/signup', findOrCreateUserByEmail);
userRouter.get('/:email', getUserByEmail);

export default userRouter;