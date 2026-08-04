import dotenv from 'dotenv';
dotenv.config();

import connectDB from '../config/db.js';
import GalleryService from '../services/gallery.service.js';
import faceService from '../services/face.service.js';

await connectDB();

const available = await faceService.isAvailable();
if (!available) {
    console.error('[SCAN] Сервис распознавания недоступен. Запустите: npm run face');
    process.exit(1);
}

const result = await GalleryService.rescanFaces({ status: 'approved' });
console.log(`[SCAN] Рескан завершён: обработано ${result.processed}, с лицами: ${result.withFaces}`);

process.exit(0);