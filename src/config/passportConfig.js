import passport from "passport";
import { Strategy as GoogleTokenStrategy } from 'passport-google-oauth20';
import { findOrCreateLocalUser } from "../controllers/userController.js";
import UserServices from "../services/userServices.js";
import { getSecret } from "../utils/secretManager.js";

const CLIENT_ID = await getSecret('CLIENT_ID');
const CLIENT_SECRET = await getSecret('CLIENT_SECRET');

passport.use(new GoogleTokenStrategy({
    clientID: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
}, async (accessToken, refreshToken, profile, cb) => {
    try {
        // Servicio moshi moshi para buscar o crear el usuario
        const user = await UserServices.findOrCreateUser(profile);

        // Si no encuentra en servicio moshi moshi, crea un usuario local
        if (!user) {
            const localUser = await findOrCreateLocalUser(profile)
            return cb(null, localUser);
        }

        // Pasa el usuario al callback
        return cb(null, user);
    } catch (error) {
        return cb(error);
    }
}));

export default passport;
