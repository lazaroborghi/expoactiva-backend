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
    },
    code: {
        type: String,
    },
    expirationCode: {
        type: Date,
    },
    validateEmail: {
        type: Boolean,
    },
    interests: [
        {
            type: String,
        }
    ],
    tickets: [
        {
            ticketId: {
                type: String,
            },
            used: {
                type: Boolean,
                default: false
            }
        }
    ],
    google: {
        type: Boolean,
        default: false
    },
});

export default mongoose.model('User', userSchema);
