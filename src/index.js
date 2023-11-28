import express from "express";
import database from "./config/database.js";
import authenticateJWT from "./middleware/authMiddleware.js";
import locationRouter from "./routes/locationRoutes.js";
import authRouter from "./routes/authRoutes.js";
import dotenv from "dotenv";
import exhibitorRouter from "./routes/exhibitorRoutes.js";
import favouriteRouter from "./routes/favouriteRoutes.js";
import { cleanUpUserEvents, checkForUpcomingEvents } from './services/cron/eventReminderCron.js';
import userRouter from "./routes/userRoutes.js";
import openLocationRouter from "./routes/openLocationRoutes.js";
import authMoshiMiddleware from "./middleware/authMoshiMiddleware.js";
import ticketRouter from "./routes/ticketRoutes.js";
import { deleteUsedTickets } from "./services/cron/usedTicketsCleanerCron.js";
import eventRouter from './routes/eventRoutes.js'
import deviceRequestRouter from "./routes/deviceRequestRoutes.js";
import { translateHandler } from "./services/translate/translateHandler.js";
import apikeyMiddleware from "./middleware/apikeyMiddleware.js";

dotenv.config();

const test = process.env.NODE_ENV === "test";

// Conectarse a la base de datos
!test && database.connect();

// Crear el servidor
const app = express();

app.use(apikeyMiddleware); // Middleware que verifica el apikey

app.use(express.json()); // Middleware que permite recibir JSON en el body de las peticiones

// Rutas de autenticación
app.use("/auth", authRouter);

// Rutas
app.use("/open/locations", openLocationRouter);
app.use("/exhibitors", exhibitorRouter);
app.use("/favourites", favouriteRouter);
app.use("/user", userRouter);
app.use("/events", eventRouter);
app.use("/device", deviceRequestRouter);

// Translate
app.post("/translate", translateHandler);

// Tarea para enviar recordatorios de eventos (Notificaciones)
app.get('/tasks/checkForEvents', async (req, res) => {
    console.log('Ejecutando la tarea de verificación de eventos');
    await cleanUpUserEvents().catch(error => console.error('Error en cleanUpUserEvents', error));
    await checkForUpcomingEvents().catch(error => console.error('Error en checkForUpcomingEvents', error));
    res.send('Tarea completada');
});

// Tarea para eliminar tickets usados
app.get('/tasks/deleteUsedTickets', async (req, res) => {
    console.log('Ejecutando la tarea de eliminación de tickets usados');
    await deleteUsedTickets().catch(error => console.error('Error en deleteUsedTickets', error));
    res.send('Tarea completada');
});

!test ? app.use("/locations", authMoshiMiddleware, locationRouter) : app.use("/locations", locationRouter);

app.use("/tickets", authenticateJWT, ticketRouter);

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});

export default app;
