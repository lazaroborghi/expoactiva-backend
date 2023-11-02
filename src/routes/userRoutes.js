import express from 'express';
import { signup, getUserByEmail, getCode, updateUser } from '../controllers/userController.js';
const userRouter = express.Router();

userRouter.post('/signup', signup);
userRouter.get('/get/:email', getUserByEmail);
userRouter.put('/update/:email', updateUser);
userRouter.get('/code', getCode);
// userRouter.post('/verifyEmail', verifyEmail);

userRouter.use((req, res) => {
    res.status(404).json({ error: "Ruta no encontrada" });
});

export default userRouter;