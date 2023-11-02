import mongoose from "mongoose";

const locationSchema = new mongoose.Schema({
    deviceId: {
        type: String,
        required: false
    },
    longitude: {
        type: Number,
        required: false
    },
    latitude: {
        type: Number,
        required: false
    },
    date: {
        type: Date,
        required: false
    },
    time: {
        type: String,
        required:false
    },
    interests: [
        {
            type: String,
        }
    ],
    ageRange: {
        type: String,
        required: false
    }
});

export default mongoose.model('Location', locationSchema);