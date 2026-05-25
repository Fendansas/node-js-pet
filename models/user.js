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
                product:{
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Product'
                },
                count: {
                    type: Number,
                    default: 1
                }
            }
        ],

        isVerified: {
            type: Boolean,
            default: false
        },
        // ===== ONLINE SYSTEM =====
        lastSeen: {
            type: Date,
            default: null
        },

        lastLogin: {
            type: Date
        },
        avatarId: {
            type: String,
            default: null
        },
        avatarMimeType: {
            type: String,
            default: null
        },
        avatarUpdatedAt: {
            type: Date,
            default: null
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);


userSchema.index({ username: 1, email: 1 });

userSchema.virtual('isDangerous').get(function () {
    return this.radiation > 70 || this.health < 30;
});

userSchema.virtual('isOnline').get(function () {

    if (!this.lastSeen) {
        return false;
    }

    const fiveMinutes = 5 * 60 * 1000;

    return Date.now() - this.lastSeen.getTime() < fiveMinutes;
});

userSchema.virtual('avatar').get(function() {
    if (this.avatarId) {
        return `/api/avatars/${this.avatarId}`;
    }
    return '/img/default-avatar.png';
});

const User = mongoose.model('User', userSchema);

export default User;