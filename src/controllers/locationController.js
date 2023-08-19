import Location from '../models/Location.js';
import Device from '../models/Device.js';

// Crear una nueva ubicación
export const newLocation = async (req, res) => {
    const { longitude, latitude, date, time, deviceIdHash } = req.body;

    // Verificar si el dispositivo existe usando el hash del deviceId
    const device = await Device.findOne({ deviceIdHash });
    if (!device) {
        return res.status(400).json({ message: 'Invalid device ID' });
    }

    const location = new Location({
        longitude,
        latitude,
        date,
        time,
        deviceId: deviceIdHash // Ahora usamos el hash
    });

    try {
        await location.save();
        res.status(201).json(location);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

// Obtener ubicaciones por fecha y hora
export const getLocationsByDateTime = async (req, res) => {
    const { date, time } = req.query;

    let query = {};
    if (date) {
        query.date = date;
    }
    if (time) {
        query.time = time;
    }

    try {
        const locations = await Location.find(query);
        if (locations.length === 0) {
            return res.status(404).json({ message: 'No locations found for the given date and/or time' });
        }
        res.status(200).json(locations);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

// Obtener ubicaciones por dispositivo
export const getLocationsByDevice = async (req, res) => {
    const deviceIdHash = req.params.deviceIdHash; // Cambio a deviceIdHash para ser coherente con el enfoque de hash

    // Verificar si el dispositivo existe usando el hash
    const device = await Device.findOne({ deviceIdHash });
    if (!device) {
        return res.status(400).json({ message: 'Invalid device ID' });
    }

    try {
        const locations = await Location.find({ deviceId: deviceIdHash });
        res.status(200).json(locations);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}
