import express from 'express';
import { signup, getUserByEmail, getCode, updateUser, resendCode } from '../controllers/userController.js';
const userRouter = express.Router();

userRouter.post('/signup', signup);
userRouter.get('/get/:email', getUserByEmail);
userRouter.put('/update/:email', updateUser);
userRouter.get('/code', getCode);
userRouter.put('/code/update/:email', resendCode);

export default userRouter;