import { getSecret } from "../utils/secretManager.js"

// Middleware para verificar apikey, deja pasar a las rutas solo si el apikey es valido
const apikeyMiddleware = async (req, res, next) => {
    try {
        const apikeySecret = await getSecret('APIKEY');

        if (req.headers.apikey === apikeySecret) {
            next();
        } else {
            res.sendStatus(401);
        }
    } catch (error) {
        res.sendStatus(401);
    }
}

export default apikeyMiddleware;