import mongoose from 'mongoose';

const deviceSchema = new mongoose.Schema({
    deviceIdHash: { // Dirección MAC hasheada
        type: String,
        required: true,
        unique: true
    },
    salt: { // Esta es la sal que se usa para hashear el deviceId
        type: String,
        required: true
    },
    deviceInfo: {
        type: String,
        required: true
    }
});

export default mongoose.model('Device', deviceSchema);
