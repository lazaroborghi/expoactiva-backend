import mongoose from 'mongoose';
import {SecretManagerServiceClient} from '@google-cloud/secret-manager';

const SECRET_NAME = 'MONGODB_URI';
const SECRET_VERSION = 'latest';

class Database {
    constructor() {
        this.connection = null;
        this.secretClient = new SecretManagerServiceClient();
    }

    async getMongoDbUriFromSecretManager() {
        const [version] = await this.secretClient.accessSecretVersion({
            name: `projects/${process.env.GOOGLE_CLOUD_PROJECT}/secrets/${SECRET_NAME}/versions/${SECRET_VERSION}`
        });

        // Obtiene el secreto y lo convierte en string.
        return version.payload.data.toString('utf8');
    }

    async connect() {
        if (!this.connection) {
            try {
                const MONGODB_URI = await this.getMongoDbUriFromSecretManager();
                console.log("URI de MongoDB: ", MONGODB_URI)
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
