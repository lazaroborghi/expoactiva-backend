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
    password: {
        type: String,
        require: false
    },
    birthDay: {
        type: Date,
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
    tickets: [
        {
            type: String,
        }
    ]
});

export default mongoose.model('User', userSchema);
