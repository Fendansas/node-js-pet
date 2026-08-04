import mongoose from "mongoose";

const personPhotoSchema = new mongoose.Schema(
    {
        imageUrl: {
            type: String,
            required: true
        },
        embedding: {
            type: [Number],
            required: true
        }
    },
    { _id: false }
);

const personSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            maxlength: 100
        },
        photos: {
            type: [personPhotoSchema],
            default: []
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
    },
    {
        timestamps: true
    }
);

personSchema.index({ name: 1 });

const Person = mongoose.model('Person', personSchema);
export default Person;
