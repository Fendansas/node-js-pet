import mongoose from "mongoose";

const ItemSchema = new mongoose.Schema({
    playerId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    code:{
        type:String,
        required: true,
        index: true
    },
    isActive:{
        type: Boolean,
        default: false
    },
    isConsumed:{
        type: Boolean,
        default: false
    },
    left: {
        type: Number,
        default: -1
    },
}, {
    timestamps:true,
    toJSON:{virtuals: true},
    toObject:{virtuals: true}
});

ItemSchema.virtual('percentageLeft').get(function (){
    if (this.left < 0) return 100;

    return 0; //  будет обработано когда появится duration
});

export default mongoose.model('Item', ItemSchema);