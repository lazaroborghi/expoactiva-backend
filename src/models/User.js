import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    sub: {
        type: String,
        required: true,
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
    }
});

export default mongoose.model('User', userSchema);
