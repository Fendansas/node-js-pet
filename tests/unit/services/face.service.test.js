import { describe, it, expect, afterEach } from 'vitest';
import FaceService from '../../../services/face.service.js';

describe('FaceService', () => {
    afterEach(() => {
        delete process.env.FACE_MATCH_THRESHOLD;
    });

    describe('cosineSimilarity', () => {
        it('returns 1 for identical vectors', () => {
            expect(FaceService.cosineSimilarity([1, 2, 3], [1, 2, 3])).toBeCloseTo(1, 5);
        });

        it('returns -1 for opposite vectors', () => {
            expect(FaceService.cosineSimilarity([1, 0], [-1, 0])).toBeCloseTo(-1, 5);
        });

        it('returns 0 for orthogonal vectors', () => {
            expect(FaceService.cosineSimilarity([1, 0], [0, 1])).toBeCloseTo(0, 5);
        });

        it('returns 0 for empty or invalid input', () => {
            expect(FaceService.cosineSimilarity([], [1, 2])).toBe(0);
            expect(FaceService.cosineSimilarity(null, [1])).toBe(0);
            expect(FaceService.cosineSimilarity([1], undefined)).toBe(0);
        });
    });

    describe('matchEmbedding', () => {
        const persons = [
            { _id: 'p1', name: 'Стрелок', photos: [{ embedding: [1, 0, 0] }] },
            { _id: 'p2', name: 'Меченый', photos: [{ embedding: [0, 1, 0] }] }
        ];

        it('matches the closest person above threshold', () => {
            const match = FaceService.matchEmbedding([0.99, 0.01, 0], persons);
            expect(match).toEqual({ personId: 'p1', name: 'Стрелок', score: expect.any(Number) });
            expect(match.score).toBeGreaterThan(0.9);
        });

        it('returns null when no face is close enough', () => {
            expect(FaceService.matchEmbedding([0, 0, 1], persons)).toBeNull();
        });

        it('picks the best photo across persons', () => {
            const multi = [
                { _id: 'p1', name: 'А', photos: [{ embedding: [0.5, 0.8, 0.3] }] },
                { _id: 'p2', name: 'Б', photos: [{ embedding: [0.95, 0.2, 0.1] }] }
            ];
            const match = FaceService.matchEmbedding([1, 0, 0], multi);
            expect(match.personId).toBe('p2');
            expect(match.name).toBe('Б');
        });

        it('respects custom threshold from env', () => {
            process.env.FACE_MATCH_THRESHOLD = '0.9';
            expect(FaceService.matchEmbedding([0.8, 0.6, 0], persons)).toBeNull();
            expect(FaceService.matchEmbedding([0.95, 0.05, 0], persons).personId).toBe('p1');
        });
    });

    describe('matchFaces', () => {
        const persons = [
            { _id: 'p1', name: 'Стрелок', photos: [{ embedding: [1, 0, 0] }] }
        ];

        it('annotates known and unknown faces, keeps bbox', () => {
            const faces = [
                { x: 0.1, y: 0.2, w: 0.3, h: 0.4, confidence: 0.95, embedding: [1, 0, 0] },
                { x: 0.5, y: 0.5, w: 0.2, h: 0.2, confidence: 0.8, embedding: [0, 1, 0] }
            ];
            const result = FaceService.matchFaces(faces, persons);

            expect(result).toHaveLength(2);
            expect(result[0]).toMatchObject({
                x: 0.1, y: 0.2, w: 0.3, h: 0.4,
                personId: 'p1', name: 'Стрелок'
            });
            expect(result[1].personId).toBeNull();
            expect(result[1].name).toBeNull();
        });

        it('returns empty array for no faces', () => {
            expect(FaceService.matchFaces([], [])).toEqual([]);
        });
    });
});
