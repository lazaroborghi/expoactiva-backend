import Location from '../models/Location.js';

// Crear una nueva ubicación
export const newLocation = async (req, res) => {
    const { longitude, latitude, date, time, deviceId, interests } = req.body;

    const location = new Location({
        longitude,
        latitude,
        date,
        time,
        deviceId,
        interests: interests || [] // Se añadirán los intereses si se proporcionan
    });

    try {
        await location.save();
        res.status(201).json(location);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

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
};

// Obtener ubicaciones por dispositivo
export const getLocationsByDevice = async (req, res) => {
    const deviceId = req.params.deviceId;

    try {
        const locations = await Location.find({ deviceId: deviceId });
        
        if (locations.length === 0) {
            return res.status(404).json({ message: 'No locations found for this device' });
        }
        
        res.status(200).json(locations);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


// Añadir intereses a una ubicación existente
export const addInterests = async (req, res) => {
    const { id } = req.params;
    const { interests } = req.body;

    try {
        const location = await Location.findById(id);
        if (!location) {
            return res.status(404).json({ message: 'Location not found' });
        }
        location.interests = [...location.interests, ...interests];
        await location.save();
        res.status(200).json(location);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Obtener ubicaciones por un rango de fechas
export const getLocationsByDateRange = async (req, res) => {
    const { startDate, endDate } = req.query;

    try {
        const locations = await Location.find({
            date: {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            }
        });
        res.status(200).json(locations);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Obtener ubicaciones por intereses
export const getLocationsByInterests = async (req, res) => {
    const { interests } = req.query;
    const interestsArray = interests.split(',');

    try {
        const locations = await Location.find({
            interests: { $in: interestsArray }
        });
        res.status(200).json(locations);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Obtener todas las ubicaciones
export const getAllLocations = async (req, res) => {
    try {
        const locations = await Location.find();
        res.status(200).json(locations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Eliminar todas las ubicaciones
export const deleteAllLocations = async (req, res) => {
    try {
        await Location.deleteMany();
        res.status(200).json({ message: 'All locations deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtener ubicaciones desde una fecha y hora específica hasta ahora
export const getLocationsFromDateTimeToNow = async (req, res) => {
    const { date, time } = req.query;
    
    // Si no se proporciona la fecha o el tiempo, se devuelve un error
    if (!date || !time) {
        return res.status(400).json({ message: 'Both date and time must be provided' });
    }

    // Crear fecha inicial a partir de los parámetros de la consulta
    const startDateTime = new Date(`${date}T${time}`);

    try {
        const locations = await Location.find({
            date: {
                $gte: startDateTime,
                // Se utiliza la fecha y hora actuales como el límite superior
                $lte: new Date()
            }
        });
        
        if (locations.length === 0) {
            return res.status(404).json(locations);
        }
        
        res.status(200).json(locations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
