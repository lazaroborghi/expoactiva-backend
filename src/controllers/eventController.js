import Event from '../models/Event.js';

export const createEvent = async (req, res) => {
    try {
        const event = new Event(req.body);
        
        if (req.files && req.files.image) {
            event.image.data = req.files.image.data;
            event.image.contentType = req.files.image.mimetype;
        }
        
        await event.save();
        res.status(201).send('Event created');
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getEventById = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).send('Event not found');

        res.json(event);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getAllEvents = async (req, res) => {
    try {
        const events = await Event.find(); // Esto obtiene todos los eventos
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: "Events not found: " + error.message });
    }
};