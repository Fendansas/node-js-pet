import mongoose from 'mongoose';

const anomalySchema = new mongoose.Schema({

        name: {
            type: String,
            required: true
        },
        latitude: {
            type: Number,
            required: true
        },
        longitude: {
            type: Number,
            required: true
        },
        radius: {
            type: Number,
            required: true
        },
        type: {
            type: String,
            required: true
        },
        value: {
            type: Number,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true,
    });

export default mongoose.model('Anomaly', anomalySchema);