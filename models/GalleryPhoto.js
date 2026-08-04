import mongoose from "mongoose";



const galleryPhotoSchema = new mongoose.Schema(
    {
        title:{
            type: String,
            default: '',
            maxlength: 200,
            trim: true
        },
        imageUrl:{
            type: String,
            required: true
        },

        author:{
            type: mongoose.Schema.Types.ObjectId,
            ref:'User',
            required: true
        },

        status:{
            type: String,
            enum: ['pending', 'approved', 'rejected'],
            default: 'pending'
        },

        moderatedBy:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null
        },
        moderatedAt:{
            type: Date,
            default: null
        },
        faces: {
            type: [{
                x: { type: Number, min: 0, max: 1 },
                y: { type: Number, min: 0, max: 1 },
                w: { type: Number, min: 0, max: 1 },
                h: { type: Number, min: 0, max: 1 },
                personId: { type: mongoose.Schema.Types.ObjectId, ref: 'Person', default: null },
                name: { type: String, default: null },
                confidence: { type: Number, default: 0 },
                embedding: { type: [Number], default: [] }
            }],
            default: [],
            _id: false
        }
    },
    {
        timestamps: true
    }
);

galleryPhotoSchema.index({status: 1, createdAt: -1});
galleryPhotoSchema.index({author: 1, createdAt: -1});

const GalleryPhoto = mongoose.model('GalleryPhoto', galleryPhotoSchema);
export default GalleryPhoto;
