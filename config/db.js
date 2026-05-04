const mongooes = require('mongoose');

const connectDB = async () =>{
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

    } catch (err){
        console.error('DB error:', err);
        process.exit(1);
    }
}