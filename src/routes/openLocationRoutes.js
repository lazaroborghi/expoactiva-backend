import express from "express";
import {
    newLocation
} from "../controllers/locationController.js";

const openLocationRouter = express.Router();

// Crear una nueva ubicación
openLocationRouter.post("/", newLocation);


export default openLocationRouter;
