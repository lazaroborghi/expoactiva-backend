// Comunicacion con Api de usuarios Moshi moshi
// Path: src\services\userServices.js
import axios from "axios";

const API_URL = "https://moshi-moshi.herokuapp.com/api";

class UserServices {
    
    static async findOrCreateUser(profile) {
        try {
            const response = await axios.post(`${API_URL}/users`, profile);
            return response.data.user;
        } catch(error) {
            throw new Error("Error al comunicarse con servicio de usuarios");
        }     
    }

}

export default UserServices;