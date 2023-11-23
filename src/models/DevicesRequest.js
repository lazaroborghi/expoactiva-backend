import mongoose from "mongoose";

const DevicesRequest = new mongoose.Schema({
    uid: {
        type: String,
        required: true,
    },
    expireTime: {
        type: Date,
        required: true,
    },
    counter: {
        type: Number,
        required: true,
    }
});

export default mongoose.model("DevicesRequest", DevicesRequest);