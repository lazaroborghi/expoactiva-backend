import express from 'express';
import authenticateJWT from '../middleware/authMiddleware.js';
import { signup, getUserByEmail, getCode, updateUser, resendCode, deleteAccount } from '../controllers/userController.js';

const userRouter = express.Router();


userRouter.post('/signup', signup);
userRouter.get('/get/:email', getUserByEmail);
userRouter.put('/update/:email', updateUser);
userRouter.get('/code', getCode);
userRouter.put('/code/update/:email', resendCode);
userRouter.delete('/delete/:email', authenticateJWT, deleteAccount);
userRouter.use((req, res) => {
    res.status(404).json({ error: "Ruta no encontrada" });
});

export default userRouter;