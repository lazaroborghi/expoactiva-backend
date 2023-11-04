import express from "express";
import {
    newLocation,
    getLocationsByDateTime,
    getLocationsByDevice,
    getLocationsByDateRange,
    getLocationsByInterests,
    getAllLocations,
    deleteAllLocations,
    getLocationsFromDateTimeToNow,
} from "../controllers/locationController.js";

const locationRouter = express.Router();

// Crear una nueva ubicación
locationRouter.post("/", newLocation);

// Obtener ubicaciones por fecha y hora
locationRouter.get("/datetime", getLocationsByDateTime);

// Obtener ubicaciones por dispositivo
locationRouter.get("/device/:deviceId", getLocationsByDevice);

// Obtener ubicaciones por un rango de fechas
locationRouter.get("/daterange", getLocationsByDateRange);

// Obtener ubicaciones por intereses
locationRouter.get("/interests", getLocationsByInterests);

// Obtener todas las ubicaciones
locationRouter.get('/', getAllLocations);

// Eliminar todas las ubicaciones
locationRouter.delete('/', deleteAllLocations);

locationRouter.get('/datetimenow', getLocationsFromDateTimeToNow);

export default locationRouter;
