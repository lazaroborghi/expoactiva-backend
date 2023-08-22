import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';

const authRouter = express.Router();

authRouter.post('/google', passport.authenticate('google-token', { session: false }), (req, res) => {
    // El usuario ha sido autenticado con éxito, crea un JWT y envíalo
    const token = jwt.sign({ userId: req.user.id }, 'SECRETO_JWT');
    res.json({ token });
});

export default authRouter;
