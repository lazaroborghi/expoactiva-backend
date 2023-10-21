import express from "express";
import cron from 'node-cron';
import database from "./config/database.js";
//import authenticateJWT from "./middleware/authMiddleware.js";
import locationRouter from "./routes/locationRoutes.js";
//import eventRouter from "./routes/eventRoutes.js";
import authRouter from "./routes/authRoutes.js";
import dotenv from "dotenv";
import exhibitorRouter from "./routes/exhibitorRoutes.js";
import favouriteRouter from "./routes/favouriteRoutes.js";
import { checkForUpcomingEvents } from './services/cron/eventReminderCron.js';

dotenv.config();

// Conectarse a la base de datos
if (process.env.NODE_ENV !== "test") {
    database.connect();
}
const app = express();

// Middlewares
app.use(express.json()); // Permite recibir JSON en el body de las peticiones

// Rutas de autenticación
app.use("/auth", authRouter);

//app.use(authenticateJWT); // Middleware para verificar JWT (se encuentra en src\middleware\authMiddleware.js

//app.use(authMoshi); // Middleware para verificar token de moshi moshi

// Rutas
app.use("/locations", locationRouter);
app.use("/exhibitors", exhibitorRouter);
app.use("/favourites", favouriteRouter);

cron.schedule('* * * * *', async () => {
    console.log('Running a task every minute');
    await checkForUpcomingEvents();
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});

export default app;
