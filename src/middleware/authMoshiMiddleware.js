import axios from 'axios';

// Valida token de moshi moshi
const API_URL = "https://expoactivawebbackend.uc.r.appspot.com/token/validate";
const authMoshiMiddleware = async (req, res, next) => {
    
    // Toma el token desde el header (Bearer: Token)
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    const res = await axios.get(API_URL, { headers: { Authorization: `Bearer ${token}` } })

    if (res.status === 200) {
        next();
    } else {
        res.sendStatus(401);
    }

}

export default authMoshiMiddleware;