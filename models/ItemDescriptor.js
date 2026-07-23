import mongoose from "mongoose";

const NULL_MODIFIER = -99999999;

const ModifiersSchema = new mongoose.Schema({
    health: {type: Number, default: NULL_MODIFIER},
    radiation: {type: Number, default: NULL_MODIFIER},
    anomaly: {type: Number, default: NULL_MODIFIER},
    mental: {type: Number, default: NULL_MODIFIER},
    burer: {type: Number, default: NULL_MODIFIER},
    radiationEmitter: {type: Number, default: NULL_MODIFIER},
    controller: {type: Number, default: NULL_MODIFIER},
    healthInstant: {type: Number, default: NULL_MODIFIER},
    radiationInstant: {type: Number, default: NULL_MODIFIER},
    monolith: {type: Number, default: NULL_MODIFIER},
}, {_id: false});

const CATEGORY_NAMES = {
    0: 'Оружие',
    1: 'Артефакты',
    2: 'Бустеры',
    3: 'Броня',
    4: 'Аптечки',
    5: 'Хабар',
    6: 'Обвес',
    7: 'Антирады',
    8: 'Еда',
    9: 'Боеприпасы',
    10: 'Фильтры',
    11: 'Приборы'
};

const ItemDescriptorSchema = new mongoose.Schema({
    code:{
        type: String,
        unique: true,
        required:true,
        index: true
    },
    name:{
        type: String,
        required:true,
    },
    description:{
        type: String,
        default:''
    },
    imageUrl:{
        type: String,
        default:''
    },
    price:{
        type: Number,
        required: true
    },
    category:{
        type: Number,
        required: true,
        enum: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
    },
    isArtifact:{type: Boolean, default: false},
    isBooster:{type: Boolean, default: false},
    isDevice:{type: Boolean, default: false},
    isArmor:{type: Boolean, default: false},
    isConsumable:{type: Boolean, default: true},
    duration:{type: Number, default: -1},
    xpPoints:{type: Number, default: 0},
    modifiers:{
        type: ModifiersSchema,
        default: ()=>({}),
    },
},{
    timestamps:true,
    toJSON:{virtuals: true},
    toObject:{virtuals: true}
});

ItemDescriptorSchema.virtual('isSingleUse').get(function (){
    return !(this.isArtifact || this.isBooster || this.isDevice || this.isArmor);
});
ItemDescriptorSchema.virtual('categoryText').get(function (){
    return CATEGORY_NAMES[this.category] || 'Неизвестно'
});

export default mongoose.model('ItemDescriptor', ItemDescriptorSchema);





