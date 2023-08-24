import axios from "axios";
import { findOrCreateLocalUser } from "../controllers/userController.js";

const API_URL = "https://moshi-moshi.herokuapp.com/api";

class UserServices {
    
    // Busca o crea el usuario. Si se autentica con moshi moshi, utiliza ese servicio, si no, usa el proceso local.
    static async findOrCreateUser(profile) {
        //try {
        //    const response = await axios.post(`${API_URL}/users`, profile);
        //    return response.data.user;
        //} catch (error) {
        //    console.error("Error al comunicarse con servicio Moshi Moshi. Utilizando método local.", error);

            // Si hay un error al comunicarse con Moshi Moshi, cae de nuevo en el método local.
            return findOrCreateLocalUser(profile);
        //}     
    }

}

export default UserServices;
