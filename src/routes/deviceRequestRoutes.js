import express from 'express';
import { put } from '../controllers/devicesRequestController.js';

const deviceRequestRouter = express.Router();

// Ruta para crear un nuevo expositor
deviceRequestRouter.put('/limitRequest/:uid', put);


export default deviceRequestRouter;
