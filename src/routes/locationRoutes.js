import express from "express";
import {
    newLocation,
    getLocationsByDateTime,
    getLocationsByDevice
} from "../controllers/locationController.js";


const locationRouter = express.Router();

// Crear una nueva ubicación
locationRouter.post("/", newLocation);

// Obtener ubicaciones por fecha y hora
locationRouter.get("/", getLocationsByDateTime);

// Obtener ubicaciones por dispositivo
locationRouter.get("/:deviceId", getLocationsByDevice);

export default locationRouter;
