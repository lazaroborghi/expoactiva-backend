import express from 'express';
import { createEventForToken, getEventsForToken, deleteEventForToken } from '../controllers/favouriteController.js';

const favouriteRouter = express.Router();

// Ruta para crear un nuevo favorito
favouriteRouter.post('/create', createEventForToken);

// Ruta para obtener un favorito por token
favouriteRouter.get('/:expoPushToken', getEventsForToken);

// Ruta para borrar un favorito
favouriteRouter.delete('/', deleteEventForToken);

export default favouriteRouter;
