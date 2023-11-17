import axios from 'axios';

// Valida token de moshi moshi
const API_URL = "https://expoactivaweb-405214.uc.r.appspot.com/token/validate";
const authMoshiMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];

        const axiosResponse = await axios.post(API_URL, {}, {
            headers: { Authorization: `Bearer ${token}` }
        });

        if (axiosResponse.status === 200) {
            next();
        } else {
            res.sendStatus(401);
        }
    } catch (error) {
        res.sendStatus(401);
    }
}

export default authMoshiMiddleware;
