import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    date: {
        type: Date,
        required: true
    },
    expositor: {
        type: String,
        required: true,
        trim: true
    },
    image: {
        data: Buffer,
        contentType: String
    }
});

export default mongoose.model('Event', eventSchema);
