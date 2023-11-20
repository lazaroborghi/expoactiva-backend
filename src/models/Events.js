import mongoose from "mongoose";

const Events = new mongoose.Schema({
    eventName: {
        type: String,
        required: true,
    },
    dateHourStart: {
        type: String,
        required: true,
    },
    dateHourEnd: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    picture: {
        type: String,
        required: true,
    }
});

export default mongoose.model("Events", Events);