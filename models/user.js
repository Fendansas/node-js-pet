import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
    {
        // ===== AUTH =====
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            minlength: 3,
            maxlength: 20
        },

        email: {
            type: String,
            unique: true,
            sparse: true,
            trim: true,
            lowercase: true
        },

        password: {
            type: String,
            required: true,
            minlength: 6
        },

        // ===== ROLE SYSTEM =====
        role: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Role'
        },

        // ===== PROFILE =====
        avatar: {
            type: String,
            default: '/img/default-avatar.png'
        },

        bio: {
            type: String,
            default: '',
            maxlength: 200
        },

        status: {
            type: String,
            enum: ['active', 'banned', 'deleted'],
            default: 'active'
        },

        // ===== STALKER GAME STYLE =====
        rank: {
            type: String,
            enum: [ 'stalker', 'svoboda', 'dolg', 'monolit'],
            default: 'stalker'
        },

        money: {
            type: Number,
            default: 0
        },

        radiation: {
            type: Number,
            default: 0
        },

        health: {
            type: Number,
            default: 100,
            min: 0,
            max: 100
        },

        inventory: [
            {
                item: String,
                count: Number
            }
        ],

        isVerified: {
            type: Boolean,
            default: false
        },

        lastLogin: {
            type: Date
        }
    },
    {
        timestamps: true
    }
);


userSchema.index({ username: 1, email: 1 });

userSchema.virtual('isDangerous').get(function () {
    return this.radiation > 70 || this.health < 30;
});

export default mongoose.model('User', userSchema);