import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    sub: {
        type: String,
        required: false,
        unique: true
    },
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
    }
});

export default mongoose.model('User', userSchema);
