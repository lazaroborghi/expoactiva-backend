import express from 'express';
import { createEvent, getEventById, getAllEvents } from '../controllers/eventController.js';

const eventRouter = express.Router();

// Ruta para crear un nuevo evento
eventRouter.post('/create', createEvent);

// Ruta para obtener un evento por ID
eventRouter.get('/:id', getEventById);

// Ruta para obtener todos los eventos
eventRouter.get('/', getAllEvents);

export default eventRouter;
