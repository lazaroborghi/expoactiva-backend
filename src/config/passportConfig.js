import passport from "passport";
import { Strategy as GoogleTokenStrategy } from 'passport-google-oauth20';
import { findOrCreateLocalUser } from "../controllers/userController.js";
import UserServices from "../services/userServices.js";  // Importa tu servicio de usuarios

passport.use(new GoogleTokenStrategy({
    clientID: '808320141330-iaeisvdg490pd61s85bauh925q77701t.apps.googleusercontent.com',
    clientSecret: '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',
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
