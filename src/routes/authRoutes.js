import express from 'express';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import { getSecret } from "../utils/secretManager.js";
import User from '../models/User.js';
import bcrypt from 'bcrypt';
import { isVerificationCodeValid } from '../utils/utils.js';
import { findOrCreateGoogleUser } from '../controllers/userController.js';

const authRouter = express.Router();

async function getWebClientId() {

    const WEB_CLIENT_ID = await getSecret('WEB_CLIENT_ID');
    return WEB_CLIENT_ID;
}

const createToken = async (payload, secretKey) => {
    if (!secretKey) { throw new Error('secretKey is missing or empty'); }

    return jwt.sign(payload, secretKey, { expiresIn: '48h' });
};

authRouter.post('/google', async (req, res) => {
    const tokenId = req.body.tokenId;
    const platform = req.body.platform;
    const IOS_CLIENT_ID = req.body.IOS_CLIENT_ID;

    try {
        const WEB_CLIENT_ID = await getWebClientId();
        const CLIENT_ID = platform === 'android' ? WEB_CLIENT_ID : IOS_CLIENT_ID;
        const oAuth2Client = new OAuth2Client(CLIENT_ID);

        const ticket = await oAuth2Client.verifyIdToken({
            idToken: tokenId,
            audience: CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const user = await findOrCreateGoogleUser({
            name: payload.name,
            email: payload.email,
            picture: payload.picture,
        });

        const jwtPayload = { id: user._id, email: user.email };
        const secretKey = await getSecret('KEY');
        const token = await createToken(jwtPayload, secretKey);

        res.json({ token, user });
    } catch (error) {
        console.error("Error in Google authentication:", error);
        return res.status(401).json({ error: 'Authentication failed', details: error.message });
    }
});

async function generateToken(user, password) {
    return new Promise((resolve, reject) => {
        bcrypt.compare(password, user.password, async (err, result) => {
            if (result) {
                const jwtPayload = { id: user.sub, email: user.email };
                const secretKey = await getSecret('KEY');
                const token = await createToken(jwtPayload, secretKey);
                resolve(token);
            } else {
                reject(new Error('Contraseña incorrecta'));
            }
        });
    });
}

async function generateTokenByCode(user, code) {
    return new Promise((resolve, reject) => {
        bcrypt.compare(code, user.code, async (err, result) => {
            if (result) {
                const jwtPayload = { id: user.sub, email: user.email };
                const secretKey = await getSecret('KEY');
                const token = await createToken(jwtPayload, secretKey);
                resolve(token);
            }
            else { reject(new Error('Contraseña codigo incorrecto')); }
        });
    });
}

authRouter.post('/login', async (req, res) => {

    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email: email });

        if (!user) { return res.status(401).json({ error: 'Usuario incorrecto' }); }

        if (!user.validateEmail) { return res.status(403).json({ error: 'La cuenta no ha sido validada' }) }

        try {
            const token = await generateToken(user, password);
            res.status(200).json({ user, token });

        } catch (error) {

            if (error.message === 'Contraseña incorrect') {
                res.status(401).json({ error: 'Contraseña incorrecta' })
            } else {
                throw error;
            }
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

authRouter.post('/firstLogin', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        const isCodeValid = isVerificationCodeValid(user.expirationCode);

        if (!isCodeValid) {
            return res.status(401).json({ error: 'Código vencido' });
        }

        const token = await generateTokenByCode(user, password);

        if (!token) {
            return res.status(401).json({ error: 'Contraseña incorrecta o código no válido' });
        }
        res.status(200).json({ user, token, message: 'firstLogin' });
    } catch (error) {
        console.error('Error en el servidor:', error);

        if (error.message === 'Contraseña incorrecta') {
            return res.status(401).json({ error: 'Contraseña incorrecta' });
        } else {
            res.status(500).json({ error: 'Error en el servidor' });
        }
    }
});
export default authRouter;
