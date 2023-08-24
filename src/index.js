import express from "express";

import database from "./config/database.js";
import authenticateJWT from "./middleware/authMiddleware.js";
import locationRouter from "./routes/locationRoutes.js";
import deviceRouter from "./routes/deviceRoutes.js";
import eventRouter from "./routes/eventRoutes.js";
import authRouter from "./routes/authRoutes.js";

// Conectarse a la base de datos
database.connect();

const app = express();

// Middlewares
app.use(express.json()); // Permite recibir JSON en el body de las peticiones

// Rutas de autenticación
app.use("/auth", authRouter);

app.use(authenticateJWT);  // Middleware para verificar JWT (se encuentra en src\middleware\authMiddleware.js (POR AHORA DESACTIVADO)

// Rutas
app.use("/locations", locationRouter);
app.use("/devices", deviceRouter);
app.use('/events', eventRouter);

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
