import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true
    },
    title:{
        type: String,
        required: true
    },
    description: String,
    reward: {
        type: Number,
        required: true,
        default: 0
    },
    order: {
        type: Number,
        default: 0
    },
    requiredForCompletion: {
        type: Boolean,
        default: true // Обязательна ли задача для завершения события
    },
    assignedTo:[{
        user:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        status: {
            type: String,
            enum: ['pending', 'in_progress', 'completed', 'failed'],
            default: 'pending'
        },
        completedAt: {
            type: Date,
            default: null
        },
        rewardGiven:{
            type: Boolean,
            default: false
        }
    }]
},{
    timestamps: true
});

export const Task = mongoose.model('Task', taskSchema);