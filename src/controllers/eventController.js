import Events from '../models/Events.js'

export const getAllEvents = async (req, res) => {

    try {
        const event = await Events.find({})
        if (event) {
            res.status(200).json(event)
            return
        }
        res.status(404).json({ message: 'Eventos no encontrados' })
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}