import express from 'express';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import UserServices from "../services/UserServices.js";
import { getSecret } from "../utils/secretManager.js";

const authRouter = express.Router();

async function getSecrets() {
    
    const [WEB_CLIENT_ID, IOS_CLIENT_ID] = await Promise.all([
        getSecret('WEB_CLIENT_ID'),
        getSecret('IOS_CLIENT_ID')
    ]);

    const secrets = {
        WEB_CLIENT_ID,
        IOS_CLIENT_ID
    };

    return secrets;

}

const createToken = async (payload, secretKey) => {
    return jwt.sign(payload, secretKey, { expiresIn: '48h' });
};

authRouter.post('/google', async (req, res) => {
    const tokenId = req.body.tokenId; // El token ID enviado desde la aplicación móvil
    const platform = req.body.platform; // La plataforma desde la que se está autenticando el usuario

    const { WEB_CLIENT_ID, IOS_CLIENT_ID } = await getSecrets();

    const CLIENT = platform === 'android' ? WEB_CLIENT_ID : IOS_CLIENT_ID;

    console.log('WEB_CLIENT_ID',WEB_CLIENT_ID);
    console.log('IOS_CLIENT_ID',IOS_CLIENT_ID);
    console.log('CLIENT',CLIENT);

    const oAuth2Client = new OAuth2Client(CLIENT);

    try {
        console.log('tokenId',tokenId);
        console.log('platform',platform);

        const ticket = await oAuth2Client.verifyIdToken({
            idToken: tokenId,
            audience: CLIENT, // Verificamos usando el client ID correspondiente
        });
        
        const payload = ticket.getPayload();
        console.log('payload',payload);

        // Autentica y crea/encuentra al usuario
        const user = await UserServices.findOrCreateUser(payload);

        // Crea y envía el JWT
        const jwtPayload = { id: user.sub, email: user.email };
        const secretKey = await getSecret('KEY');
        const token = await createToken(jwtPayload, secretKey);
        
        res.json({ token, user: user });

    } catch (error) {
        return res.status(401).json({ error: 'Authentication failed' });
    }
});

export default authRouter;
