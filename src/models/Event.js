import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
    eventName: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: false,
        trim: true
    },
    dateHourStart: {
        type: Date,
        required: true
    },
    dateHourEnd: {	
        type: Date,
        required: true
    },
    type: {
        type: String,
        required: false,
        trim: true
    },
    idPerson: {
        type: Number,
        required: false,
    },
    person: {
        type: Number,
        required: false,
    },
    picture: {
        type: String,
        required: false,
    }
});

export default mongoose.model('Event', eventSchema);
