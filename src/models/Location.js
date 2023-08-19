import mongoose from "mongoose";

const locationSchema = new mongoose.Schema({
    deviceId: {
        type: String,
        required: true
    },
    longitude: {
        type: Number,
        required: true
    },
    latitude: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    time: {
        type: String,
        required:true
    }
})

export default mongoose.model('Location', locationSchema)