import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema({
    ticketId: {
        type: String,
        required: true,
        unique: true
    },
    used: {
        type: Boolean,
        required: true,
    },
    email: {
        type: String,
        required: true
    },
    shared: {
        type: Boolean,
        default: false
    },
});

export default mongoose.model('Ticket', ticketSchema);
