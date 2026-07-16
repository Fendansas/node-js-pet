import mongoose from 'mongoose';
import { GridFSBucket } from 'mongodb';

let bucket;

class AvatarRepository {
    async init() {
        if (!bucket) {
            const db = mongoose.connection.db;
            if (db) {
                bucket = new GridFSBucket(db, { bucketName: 'avatars' });
            } else {
                throw new Error('Database connection not established');
            }
        }
        return bucket;
    }

    async upload(filename, fileBuffer, metadata) {
        await this.init();

        const uploadStream = bucket.openUploadStream(`${Date.now()}-${filename}`, {
            metadata
        });

        uploadStream.end(fileBuffer);

        const uploadedFile = await new Promise((resolve, reject) => {
            uploadStream.on('finish', () => {
                resolve({ _id: uploadStream.id });
            });
            uploadStream.on('error', reject);
        });

        return uploadedFile;
    }

    async getDownloadStream(avatarId) {
        await this.init();
        const fileId = new mongoose.Types.ObjectId(avatarId);
        return bucket.openDownloadStream(fileId);
    }

    async delete(avatarId) {
        await this.init();
        const fileId = new mongoose.Types.ObjectId(avatarId);
        await bucket.delete(fileId);
    }
}

export default new AvatarRepository();
