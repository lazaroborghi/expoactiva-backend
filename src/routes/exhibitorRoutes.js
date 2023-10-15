import express from 'express';
import { createExhibitor, getExhibitorById, getAllExhibitors, deleteExhibitorById } from '../controllers/exhibitorController.js';

const exhibitorRouter = express.Router();

// Ruta para crear un nuevo expositor
exhibitorRouter.post('/create', createExhibitor);

// Ruta para obtener un expositor por ID
exhibitorRouter.get('/:id', getExhibitorById);

// Ruta para obtener todos los expositor
exhibitorRouter.get('/', getAllExhibitors);

// Ruta para  borrar expositor
exhibitorRouter.delete('/', deleteExhibitorById);

export default exhibitorRouter;
