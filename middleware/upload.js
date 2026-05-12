import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
    destination:(req, file, cd)=>{
        cd(null, "public/uploads")
    },

    filename:(req, file, cd)=>{
        cd(
            null,
            Date.now() + path.extname(file.originalname)
        );
    },
});

const upload = multer({
    storage: storage
});

export default upload;
