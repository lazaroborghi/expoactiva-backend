import express from 'express';
import { findOrCreateUserByEmail, getUserByEmail, getCode, updateUser } from '../controllers/userController.js';
const userRouter = express.Router();

userRouter.post('/signup', findOrCreateUserByEmail);
userRouter.get('/:email', getUserByEmail);
userRouter.get('/code/:email', getCode);
userRouter.put('/update/:email', updateUser);
// userRouter.post('/verifyEmail', verifyEmail);

export default userRouter;