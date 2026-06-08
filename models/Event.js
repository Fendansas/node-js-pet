import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    startTime:Date,
    endTime: Date,
    status: {
        type: String,
        enum: ['draft', 'active', 'completed'],
        default: 'draft'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export const Event = mongoose.model('Event', eventSchema);
