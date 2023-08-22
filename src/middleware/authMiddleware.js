import jwt from 'jsonwebtoken';
import { getSecret } from '../utils/secretManager.js';


const authenticateJWT = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    const secretKey = await getSecret('KEY');

    if (!token) {
        console.log("No token provided");
        return res.sendStatus(401);
    }

    console.log("Token received:", token);

    jwt.verify(token, secretKey, (err, data) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid or expired token.' });
        }

        console.log("Token verified:", data);

        if (data) {
            next();
        } else {
            res.sendStatus(403);
        }
    });
};

export default authenticateJWT;
