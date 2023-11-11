import jwt from 'jsonwebtoken';
import { getSecret } from '../utils/secretManager.js';

// Middleware para verificar jwt, deja pasar a las rutas solo si el token es valido
const authenticateJWT = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    const secretKey = await getSecret('KEY');

    if (!token) {
        console.log("No token provided");
        return res.sendStatus(401);
    }

    try {
        const data = jwt.verify(token, secretKey);
        console.log("Token verified:", data);
        req.user = data;
        next();
    } catch (err) {
        console.error("Token verification failed:", err);
        return res.status(403).json({ message: 'Invalid or expired token.' });
    }
};

export default authenticateJWT;
