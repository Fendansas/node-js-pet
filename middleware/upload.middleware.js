import multer from "multer";
import mongoose from "mongoose";

const { ObjectId } = mongoose.Types;


const storage = multer.memoryStorage();

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5  // 5MB
    },
    fileFilter: (req, file, cb) => {
        const allowedFileTypes = /jpeg|jpg|png|gif|webp/;
        const mimetype = allowedFileTypes.test(file.mimetype);
        
        if (mimetype) {
            cb(null, true);
        } else {
            cb(new Error('Только изображения (JPEG, PNG, GIF, WEBP)'));
        }
    }
});

export default upload;
