import mongoose from "mongoose";

const configSchema = new mongoose.Schema({
    acceptPayments: {
        type: Boolean,
        default: true
    }
});

export default mongoose.model("Config", configSchema);