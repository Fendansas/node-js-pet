import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Основной storage для общих загрузок
const storage = multer.diskStorage({
    destination: (req, file, cd) => {
        const uploadPath = 'public/uploads';
        
        // Создаём папку если не существует
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        
        cd(null, uploadPath);
    },

    filename: (req, file, cd) => {
        cd(
            null,
            Date.now() + path.extname(file.originalname)
        );
    },
});

// Storage для скриншотов карты
const screenshotStorage = multer.diskStorage({
    destination: (req, file, cd) => {
        const uploadPath = 'public/uploads/screenshots';
        
        // Создаём папку если не существует
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        
        cd(null, uploadPath);
    },

    filename: (req, file, cd) => {
        // Сохраняем оригинальное имя из blob
        const originalName = file.originalname || 'screenshot.png';
        cd(null, originalName);
    },
});

const upload = multer({
    storage: storage
});

const uploadScreenshot = multer({
    storage: screenshotStorage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB
    },
    fileFilter: (req, file, cd) => {
        if (file.mimetype.startsWith('image/')) {
            cd(null, true);
        } else {
            cd(new Error('Только изображения!'));
        }
    }
});

// Storage для overlay-картинок
const overlayStorage = multer.diskStorage({
    destination: (req, file, cd) => {
        const uploadPath = 'public/uploads/overlays';

        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }

        cd(null, uploadPath);
    },

    filename: (req, file, cd) => {
        cd(null, Date.now() + '-' + file.originalname);
    },
});

const uploadOverlay = multer({
    storage: overlayStorage,
    limits: { fileSize: 20 * 1024 * 1024 },
    fileFilter: (req, file, cd) => {
        if (file.mimetype.startsWith('image/')) {
            cd(null, true);
        } else {
            cd(new Error('Только изображения!'));
        }
    }
});

export { upload, uploadScreenshot, uploadOverlay };
export default upload;
