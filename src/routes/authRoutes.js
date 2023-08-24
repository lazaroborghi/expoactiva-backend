import express from 'express';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import UserServices from "../services/UserServices.js";
import { getSecret } from "../utils/secretManager.js";

const authRouter = express.Router();

const WEB_CLIENT_ID = await getSecret('WEB_CLIENT_ID'); // Obtén el webClientId desde tu secret manager

const oAuth2Client = new OAuth2Client(WEB_CLIENT_ID); // Usamos un único cliente ahora

const createToken = async (payload, secretKey) => {
    return jwt.sign(payload, secretKey, { expiresIn: '24h' });
};

authRouter.post('/google', async (req, res) => {
    const tokenId = req.body.tokenId; // El token ID enviado desde la aplicación móvil

    try {
        const ticket = await oAuth2Client.verifyIdToken({
            idToken: tokenId,
            audience: WEB_CLIENT_ID, // Verificamos usando solo el webClientId
        });
        
        const payload = ticket.getPayload();
        console.log("payload",payload)

        // Autentica y crea/encuentra al usuario
        const user = await UserServices.findOrCreateUser(payload);

        // Crea y envía el JWT
        const jwtPayload = { id: user.sub, email: user.email };
        const secretKey = await getSecret('KEY');
        const token = await createToken(jwtPayload, secretKey);
        
        console.log("jwtToken",token)
        res.json({ token, user: user });

    } catch (error) {
        return res.status(401).json({ error: 'Authentication failed' });
    }
});

export default authRouter;
