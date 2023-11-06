import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    picture: {
        type: String,
        default: null
    },
    birthDay: {
        type: String,
        require: false
    },
    code: {
        type: String,
        require: true
    },
    expirationCode: {
        type: Date,
        require: true
    },
    validateEmail: {
        type: Boolean,
        require: true
    },
    interests: {
        type: Array,
        require: false,
        default: []
    }
});

export default mongoose.model('User', userSchema);
