// Comunicacion con Api de eventos Moshi moshi
// Path: src\services\EventServices.js
import axios from "axios";

const API_URL = "https://moshi-moshi.herokuapp.com/api";

class EventServices {
    
    static async getAllEvents() {
        try {
            const response = await axios.get(`${API_URL}/events`);
            return response.data.events;
        } catch(error) {
            throw new Error("Error al comunicarse con servicio de eventos");
        }     
    }

}

export default EventServices;