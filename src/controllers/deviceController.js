import Device from '../models/Device.js';
import { generateRandomSalt, hashMacAddressWithSalt } from '../utils/hashUtils.js';

// Registrar un nuevo dispositivo
export const registerDevice = async (req, res) => {
    const { macAddress, deviceInfo } = req.body;

    // Verificar si el dispositivo ya está registrado
    const existingDevice = await Device.findOne({ deviceIdHash: hashMacAddressWithSalt(macAddress, generateRandomSalt()).hash });
    if (existingDevice) {
        return res.status(400).json({ message: 'Device is already registered' });
    }

    // Si no, registrar el nuevo dispositivo
    const { salt, hash } = hashMacAddressWithSalt(macAddress, generateRandomSalt());

    const device = new Device({
        deviceIdHash: hash,
        salt: salt,
        deviceInfo: deviceInfo
    });

    try {
        await device.save();
        res.status(201).json({ message: 'Device registered successfully', deviceIdHash: hash }); // Retornar el hash para futuras referencias
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

// Obtener información de un dispositivo
export const getDeviceInfo = async (req, res) => {
    const deviceIdHash = req.params.deviceIdHash;

    try {
        const device = await Device.findOne({ deviceIdHash: deviceIdHash });

        if (!device) {
            return res.status(404).json({ message: 'Device not found' });
        }

        res.status(200).json({
            deviceInfo: device.deviceInfo
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

// Obtener todos los dispositivos
export const getAllDevices = async (req, res) => {
    try {
        const devices = await Device.find();

        res.status(200).json(devices);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}
