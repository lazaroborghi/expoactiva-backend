import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { getSecret } from '../utils/secretManager.js';

const authRouter = express.Router();

authRouter.post('/google', passport.authenticate('google-token', { session: false }), async (req, res) => {
    
    const user = req.user;

    if (!user) {
        return res.status(401).send('User Not Authenticated');
    }

    // Prepara el payload para JWT
    const payload = {
        id: user.id,
        email: user.email
    };

    // Crea el JWT y envía en la respuesta

    const secretKey = await getSecret('KEY');
    const token = jwt.sign(payload, secretKey, { expiresIn: '24h' });
    res.json({ token, user });

});

export default authRouter;
