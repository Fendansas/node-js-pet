import fs from 'fs/promises';

const FACE_SERVICE_URL = process.env.FACE_SERVICE_URL || 'http://127.0.0.1:8008';

class FaceService {
    async isAvailable() {
        try {
            const res = await fetch(`${FACE_SERVICE_URL}/health`, {
                signal: AbortSignal.timeout(3000)
            });
            return res.ok;
        } catch (error) {
            return false;
        }
    }

    async scanImage(imagePath) {
        let buffer;
        try {
            buffer = await fs.readFile(imagePath);
        } catch (error) {
            const e = new Error('FACE_SERVICE_ERROR');
            e.code = 'FACE_SERVICE_ERROR';
            throw e;
        }

        try {
            const form = new FormData();
            form.append('file', new Blob([buffer], { type: 'image/jpeg' }), 'scan.jpg');

            const res = await fetch(`${FACE_SERVICE_URL}/api/scan`, {
                method: 'POST',
                body: form,
                signal: AbortSignal.timeout(60000)
            });

            if (!res.ok) {
                throw new Error('FACE_SERVICE_HTTP_' + res.status);
            }

            const data = await res.json();
            return data.success ? data.faces : [];
        } catch (error) {
            const e = new Error('FACE_SERVICE_ERROR');
            e.code = 'FACE_SERVICE_ERROR';
            throw e;
        }
    }

    cosineSimilarity(a, b) {
        if (!Array.isArray(a) || !Array.isArray(b) || a.length === 0 || b.length === 0) {
            return 0;
        }
        const len = Math.min(a.length, b.length);
        let dot = 0;
        let na = 0;
        let nb = 0;
        for (let i = 0; i < len; i++) {
            dot += a[i] * b[i];
            na += a[i] * a[i];
            nb += b[i] * b[i];
        }
        if (na === 0 || nb === 0) return 0;
        return dot / (Math.sqrt(na) * Math.sqrt(nb));
    }

    getThreshold() {
        return parseFloat(process.env.FACE_MATCH_THRESHOLD || '0.4');
    }

    matchEmbedding(embedding, persons) {
        let best = { person: null, score: -1 };

        for (const person of persons || []) {
            for (const photo of person.photos || []) {
                if (!photo?.embedding) continue;
                const score = this.cosineSimilarity(embedding, photo.embedding);
                if (score > best.score) {
                    best = { person, score };
                }
            }
        }

        if (!best.person || best.score < this.getThreshold()) {
            return null;
        }

        return {
            personId: best.person._id,
            name: best.person.name,
            score: best.score
        };
    }

    matchFaces(faces, persons) {
        return (faces || []).map(face => {
            const match = face.embedding ? this.matchEmbedding(face.embedding, persons) : null;
            return {
                x: face.x,
                y: face.y,
                w: face.w,
                h: face.h,
                confidence: face.confidence || 0,
                embedding: face.embedding || [],
                personId: match?.personId || null,
                name: match?.name || null
            };
        });
    }
}

export default new FaceService();
