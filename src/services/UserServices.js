//import axios from "axios";
import { findOrCreateLocalUser } from "../controllers/userController.js";

//const API_URL = "https://moshi-moshi.herokuapp.com/api";

class UserServices {
    
    static async findOrCreateUser(profile) {

        return findOrCreateLocalUser(profile);
        //}     
    }

}

export default UserServices;
