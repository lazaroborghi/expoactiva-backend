import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://lazaroborghi:Lazaro$23@clusterexpoactiva.bwdb9x0.mongodb.net/"

class Database {
    constructor() {
        this.connection = null;
    }

    async connect() {
        if (!this.connection) {
            try {
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
