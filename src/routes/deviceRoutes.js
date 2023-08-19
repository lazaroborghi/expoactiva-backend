import express from 'express';
import { 
    registerDevice, 
    getDeviceInfo,
    getAllDevices
} from '../controllers/deviceController.js';

const deviceRouter = express.Router();

// Ruta para registrar un nuevo dispositivo
deviceRouter.post('/', registerDevice);

// Ruta para obtener información de un dispositivo específico usando su hash
deviceRouter.get('/:deviceIdHash', getDeviceInfo);

// Ruta para obtener todos los dispositivos registrados
deviceRouter.get('/', getAllDevices);

export default deviceRouter;
