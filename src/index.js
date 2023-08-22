import express from "express";
import passport from "passport";
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

import database from "./config/database.js";
import locationRouter from "./routes/locationRoutes.js";
import deviceRouter from "./routes/deviceRoutes.js";
import eventRouter from "./routes/eventRoutes.js";
import authRouter from "./routes/authRoutes.js";

// Conectarse a la base de datos
database.connect();

// Configuración de Passport para Google OAuth
passport.use(new GoogleStrategy({
    clientID: '808320141330-iaeisvdg490pd61s85bauh925q77701t.apps.googleusercontent.com',
    clientSecret: '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',
    callbackURL: "https://expoactiva-nacional-395522.rj.r.appspot.com/auth/google/callback"
}, (accessToken, refreshToken, profile, cb) => {
    // Aquí puedes encontrar o crear un usuario en tu base de datos con la información de `profile`
    return cb(null, profile);
}));

const app = express();
app.use(express.json());
app.use(passport.initialize());  // Inicializa Passport

// Rutas
app.use("/auth", authRouter);
app.use("/locations", locationRouter);
app.use("/devices", deviceRouter);
app.use('/events', eventRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
