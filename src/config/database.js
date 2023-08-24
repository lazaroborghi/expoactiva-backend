import mongoose from 'mongoose';
import { getSecret } from '../utils/secretManager.js';  // Importa la función

class Database {
    constructor() {
        this.connection = null;
    }

    async connect() {
        if (!this.connection) {
            try {
                const MONGODB_URI = await getSecret('MONGODB_URI');                
                this.connection = await mongoose.connect(MONGODB_URI, {
                    useNewUrlParser: true,
                    useUnifiedTopology: true
                });
                
                console.log(`MongoDB Connected: ${this.connection.connection.host}`);
            } catch (error) {
                console.error(`Error: ${error.message}`);
                process.exit(1);
            }
        }
        return this.connection;
    }
}

export default new Database();
