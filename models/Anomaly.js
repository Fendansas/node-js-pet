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
        screenshot: {
            type: String,
            default: null
        },
        bounds: {
            lat1: Number,
            lng1: Number,
            lat2: Number,
            lng2: Number
        },
        // Пометки/маркеры на карте
        markers: [{
            type: {
                type: String,
                enum: ['marker', 'line', 'polygon', 'circle', 'text', 'area'],
                default: 'marker'
            },
            lat: Number,
            lng: Number,
            lat2: Number,  // Для линий/полигонов
            lng2: Number,
            label: {
                type: String,
                default: ''
            },
            style: {
                color: String,      // Цвет линии/маркера
                fillColor: String,  // Цвет заливки
                iconType: String,   // Тип иконки
                fontSize: Number,
                fontColor: String
            },
            danger: {
                type: String,
                enum: ['none', 'low', 'medium', 'high', 'extreme'],
                default: 'none'
            },
            faction: {
                type: String,
                enum: ['none', 'stalker', 'military', 'bandit', 'ecologist', 'clearsky', 'monolith', 'dolg', 'svoboda'],
                default: 'none'
            },
            notes: String
        }],
        createdAt: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true,
    });

export default mongoose.model('Anomaly', anomalySchema);