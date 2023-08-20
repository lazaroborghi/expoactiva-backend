import mongoose from 'mongoose';

class Database {
    constructor() {
        this.connection = null;
    }

    async connect() {
        if (!this.connection) {
            try {
                console.log("URI de MongoDB: ", process.env.MONGODB_URI)
                this.connection = await mongoose.connect(process.env.MONGODB_URI, {
                    useNewUrlParser: true,
                    useUnifiedTopology: true,
                    useCreateIndex: true
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
