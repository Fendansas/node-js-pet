import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../../repositories/product.repository.js', () => ({
    default: {
        findById: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
        findByCategory: vi.fn(),
        getCategories: vi.fn(),
    }
}));

vi.mock('../../../repositories/user.repository.js', () => ({
    default: {
        findById: vi.fn(),
        findWithRoleAndInventory: vi.fn(),
    }
}));

import productRepository from '../../../repositories/product.repository.js';
import userRepository from '../../../repositories/user.repository.js';
import ProductService from '../../../services/product.service.js';

describe('ProductService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('getById', () => {
        it('should return product if found', async () => {
            productRepository.findById.mockResolvedValue({ _id: 'p1', title: 'Test' });
            const result = await ProductService.getById('p1');
            expect(result.title).toBe('Test');
        });

        it('should throw PRODUCT_NOT_FOUND', async () => {
            productRepository.findById.mockResolvedValue(null);
            await expect(ProductService.getById('missing')).rejects.toThrow('PRODUCT_NOT_FOUND');
        });
    });

    describe('create', () => {
        it('should create and return product', async () => {
            productRepository.create.mockResolvedValue({ _id: 'p1', title: 'New' });
            const result = await ProductService.create({ title: 'New' });
            expect(result._id).toBe('p1');
        });
    });

    describe('update', () => {
        it('should throw PRODUCT_NOT_FOUND if not exists', async () => {
            productRepository.findById.mockResolvedValue(null);
            await expect(ProductService.update('p1', {})).rejects.toThrow('PRODUCT_NOT_FOUND');
        });

        it('should update existing product', async () => {
            productRepository.findById.mockResolvedValue({ _id: 'p1' });
            productRepository.update.mockResolvedValue({ _id: 'p1', title: 'Updated' });
            const result = await ProductService.update('p1', { title: 'Updated' });
            expect(result.title).toBe('Updated');
        });
    });

    describe('delete', () => {
        it('should throw PRODUCT_NOT_FOUND if not exists', async () => {
            productRepository.findById.mockResolvedValue(null);
            await expect(ProductService.delete('p1')).rejects.toThrow('PRODUCT_NOT_FOUND');
        });

        it('should delete existing product', async () => {
            productRepository.findById.mockResolvedValue({ _id: 'p1' });
            productRepository.delete.mockResolvedValue({ _id: 'p1' });
            await expect(ProductService.delete('p1')).resolves.toBeDefined();
        });
    });

    describe('buyProduct', () => {
        it('should throw USER_NOT_FOUND if user not found', async () => {
            userRepository.findById.mockResolvedValue(null);
            await expect(ProductService.buyProduct('u1', 'p1')).rejects.toThrow('USER_NOT_FOUND');
        });

        it('should throw PRODUCT_NOT_FOUND if product not found', async () => {
            userRepository.findById.mockResolvedValue({ _id: 'u1' });
            productRepository.findById.mockResolvedValue(null);
            await expect(ProductService.buyProduct('u1', 'p1')).rejects.toThrow('PRODUCT_NOT_FOUND');
        });

        it('should throw INSUFFICIENT_FUNDS if not enough money', async () => {
            userRepository.findById.mockResolvedValue({ _id: 'u1', money: 50, inventory: [], save: vi.fn() });
            productRepository.findById.mockResolvedValue({ _id: 'p1', price: 100 });
            await expect(ProductService.buyProduct('u1', 'p1')).rejects.toThrow('INSUFFICIENT_FUNDS');
        });

        it('should deduct money and add to inventory', async () => {
            const mockUser = { _id: 'u1', money: 200, inventory: [], save: vi.fn() };
            userRepository.findById.mockResolvedValue(mockUser);
            productRepository.findById.mockResolvedValue({ _id: 'p1', price: 100 });

            const result = await ProductService.buyProduct('u1', 'p1');

            expect(mockUser.money).toBe(100);
            expect(mockUser.inventory).toHaveLength(1);
            expect(mockUser.inventory[0].product).toBe('p1');
            expect(mockUser.inventory[0].count).toBe(1);
            expect(mockUser.save).toHaveBeenCalled();
        });

        it('should increment count if product already in inventory', async () => {
            const mockUser = {
                _id: 'u1', money: 300,
                inventory: [{ product: { toString: () => 'p1' }, count: 2 }],
                save: vi.fn()
            };
            userRepository.findById.mockResolvedValue(mockUser);
            productRepository.findById.mockResolvedValue({ _id: 'p1', price: 100 });

            await ProductService.buyProduct('u1', 'p1');

            expect(mockUser.money).toBe(200);
            expect(mockUser.inventory[0].count).toBe(3);
        });
    });
});
