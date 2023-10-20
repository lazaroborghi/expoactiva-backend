import UserEvent from "../models/UserEvent.js";

// da de alta un favorito
export const createEventForToken = async (req, res) => {
    const { expoPushToken, eventId, eventStartTime } = req.body;

    try {
        // Verifica si el evento ya está asociado con el token
        const existingEntry = await UserEvent.findOne({ expoPushToken, eventId });

        if (existingEntry) {
            return res.status(400).json({ message: "This event is already added to the token." });
        }

        const newUserEvent = new UserEvent({ expoPushToken, eventId, eventStartTime }); 
        const savedUserEvent = await newUserEvent.save();

        res.status(201).json(savedUserEvent);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

// Controlador para obtener eventos por token
export const getEventsForToken = async (req, res) => {
    const { expoPushToken } = req.params;
  
    try {
      const userEvents = await UserEvent.find({ expoPushToken });
      res.status(200).json(userEvents);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  // Controlador para eliminar una relación entre evento y token
  export const deleteEventForToken = async (req, res) => {
    const { expoPushToken, eventId } = req.body;
  
    try {
      const result = await UserEvent.findOneAndDelete({ expoPushToken, eventId });
  
      if (!result) {
        return res.status(404).json({ message: 'Event for token not found' });
      }
  
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  