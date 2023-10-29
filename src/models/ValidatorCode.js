import mongoose from "mongoose";

const validatorCodeSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true
    },
    expirationDate: {
        type: Date,
        require: true
    }

});

export default mongoose.model('ValidatorCode', validatorCodeSchema);