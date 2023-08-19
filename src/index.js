import express from "express";
import locationRouter from "./routes/locationRoutes.js";
import deviceRouter from "./routes/deviceRoutes.js";

const app = express(); // Crea una instancia de express
app.use(express.json()); // Middleware para parsear cuerpos JSON

// Define rutas de geolocalizaciones
app.use("/locations", locationRouter);

// Define rutas de dispositivos
app.use("/devices", deviceRouter);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});