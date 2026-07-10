import mongoose from 'mongoose';

const mapOverlaySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    bounds: {
        lat1: { type: Number, required: true },
        lng1: { type: Number, required: true },
        lat2: { type: Number, required: true },
        lng2: { type: Number, required: true }
    },
    opacity: {
        type: Number,
        default: 0.8,
        min: 0,
        max: 1
    },
    zIndex: {
        type: Number,
        default: 1
    }
}, {
    timestamps: true
});

export default mongoose.model('MapOverlay', mapOverlaySchema);
