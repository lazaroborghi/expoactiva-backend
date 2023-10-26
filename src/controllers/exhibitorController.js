import Exhibitor from '../models/Exhibitor.js';

export const getAllExhibitors = async (req, res) => {
    try {
        const exhibitor = await Exhibitor.find({});
        res.status(200).json(exhibitor);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const createExhibitor = async (req, res) => {
    try {
        const exhibitor = new Exhibitor(req.body);
        await exhibitor.save();
        res.status(201).json(exhibitor);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

export const getExhibitorById = async (req, res) => {
    try {
        const { id } = req.params;
        const exhibitor = await exhibitor.findById(id);
        if (!exhibitor) {
            res.status(404).json({ error: "Event not found" });
            return;
        }
        res.status(200).json(exhibitor);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const deleteExhibitorById = async (req, res) => {
    try {
        const { id } = req.params;
        const exhibitor = await exhibitor.findByIdAndDelete(id);
        if (!exhibitor) {
            res.status(404).json({ error: "Event not found" });
            return;
        }
        res.status(200).json({ message: "Event deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const deleteAll = async (req, res) => {
    try {
        const exhibitor = await Exhibitor.deleteMany({});
        if (!exhibitor) {
            res.status(404).json({ error: "Event not found" });
            return;
        }
        res.status(200).json({ message: "Event deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
