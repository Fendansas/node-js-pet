import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../../repositories/itemDescriptor.repository.js', () => ({
    default: {
        create: vi.fn(),
        findByCategory: vi.fn(),
        findById: vi.fn(),
        findByCode: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
        getCategories: vi.fn(),
    }
}));

vi.mock('../../../repositories/item.repository.js', () => ({
    default: {
        findByPlayer: vi.fn(),
    }
}));

vi.mock('../../../repositories/user.repository.js', () => ({
    default: {
        findById: vi.fn(),
    }
}));

vi.mock('../../../models/Item.js', () => ({
    default: {
        create: vi.fn(),
    }
}));

import itemDescriptorRepository from '../../../repositories/itemDescriptor.repository.js';
import itemRepository from '../../../repositories/item.repository.js';
import userRepository from '../../../repositories/user.repository.js';
import Item from '../../../models/Item.js';
import ProductService from '../../../services/product.service.js';

describe('ProductService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('getById', () => {
        it('should return descriptor if found', async () => {
            itemDescriptorRepository.findById.mockResolvedValue({ _id: 'p1', title: 'Test' });
            const result = await ProductService.getById('p1');
            expect(result.title).toBe('Test');
        });

        it('should throw PRODUCT_NOT_FOUND if not found', async () => {
            itemDescriptorRepository.findById.mockResolvedValue(null);
            await expect(ProductService.getById('missing')).rejects.toThrow('PRODUCT_NOT_FOUND');
        });
    });

    describe('getAll', () => {
        it('should call findByCategory with category', async () => {
            itemDescriptorRepository.findByCategory.mockResolvedValue([{ _id: 'p1' }]);
            const result = await ProductService.getAll('weapon');
            expect(itemDescriptorRepository.findByCategory).toHaveBeenCalledWith('weapon');
            expect(result).toHaveLength(1);
        });

        it('should call findByCategory with null if no category', async () => {
            itemDescriptorRepository.findByCategory.mockResolvedValue([]);
            await ProductService.getAll();
            expect(itemDescriptorRepository.findByCategory).toHaveBeenCalledWith(null);
        });
    });

    describe('create', () => {
        it('should create and return descriptor', async () => {
            itemDescriptorRepository.create.mockResolvedValue({ _id: 'p1', title: 'New' });
            const result = await ProductService.create({ title: 'New' });
            expect(result._id).toBe('p1');
        });
    });

    describe('update', () => {
        it('should throw PRODUCT_NOT_FOUND if not exists', async () => {
            itemDescriptorRepository.findById.mockResolvedValue(null);
            await expect(ProductService.update('p1', {})).rejects.toThrow('PRODUCT_NOT_FOUND');
        });

        it('should update existing descriptor', async () => {
            itemDescriptorRepository.findById.mockResolvedValue({ _id: 'p1' });
            itemDescriptorRepository.update.mockResolvedValue({ _id: 'p1', title: 'Updated' });
            const result = await ProductService.update('p1', { title: 'Updated' });
            expect(result.title).toBe('Updated');
        });
    });

    describe('delete', () => {
        it('should throw PRODUCT_NOT_FOUND if not exists', async () => {
            itemDescriptorRepository.findById.mockResolvedValue(null);
            await expect(ProductService.delete('p1')).rejects.toThrow('PRODUCT_NOT_FOUND');
        });

        it('should delete existing descriptor', async () => {
            itemDescriptorRepository.findById.mockResolvedValue({ _id: 'p1' });
            itemDescriptorRepository.delete.mockResolvedValue({ _id: 'p1' });
            await expect(ProductService.delete('p1')).resolves.toBeDefined();
        });
    });

    describe('getCategories', () => {
        it('should return categories', async () => {
            itemDescriptorRepository.getCategories.mockResolvedValue(['weapon', 'artifact']);
            const result = await ProductService.getCategories();
            expect(result).toEqual(['weapon', 'artifact']);
        });
    });

    describe('buyProduct', () => {
        it('should throw USER_NOT_FOUND if user not found', async () => {
            userRepository.findById.mockResolvedValue(null);
            await expect(ProductService.buyProduct('u1', 'p1')).rejects.toThrow('USER_NOT_FOUND');
        });

        it('should throw PRODUCT_NOT_FOUND if descriptor not found', async () => {
            userRepository.findById.mockResolvedValue({ _id: 'u1', money: 200 });
            itemDescriptorRepository.findById.mockResolvedValue(null);
            await expect(ProductService.buyProduct('u1', 'p1')).rejects.toThrow('PRODUCT_NOT_FOUND');
        });

        it('should throw INSUFFICIENT_FUNDS if not enough money', async () => {
            userRepository.findById.mockResolvedValue({ _id: 'u1', money: 50, save: vi.fn() });
            itemDescriptorRepository.findById.mockResolvedValue({ _id: 'p1', price: 100 });
            await expect(ProductService.buyProduct('u1', 'p1')).rejects.toThrow('INSUFFICIENT_FUNDS');
        });

        it('should deduct money, save user and create item', async () => {
            const mockUser = { _id: 'u1', money: 200, save: vi.fn() };
            const mockItem = { _id: 'i1', playerId: 'u1', code: 'medkit', left: 3 };
            userRepository.findById.mockResolvedValue(mockUser);
            itemDescriptorRepository.findById.mockResolvedValue({ _id: 'p1', price: 100, code: 'medkit', duration: 3 });
            Item.create.mockResolvedValue(mockItem);

            const result = await ProductService.buyProduct('u1', 'p1');

            expect(mockUser.money).toBe(100);
            expect(mockUser.save).toHaveBeenCalled();
            expect(Item.create).toHaveBeenCalledWith({
                playerId: 'u1',
                code: 'medkit',
                left: 3
            });
            expect(result).toEqual({ user: mockUser, item: mockItem });
        });
    });

    describe('getUserInventory', () => {
        it('should return items enriched with descriptor', async () => {
            const mockItem = {
                code: 'medkit',
                toObject: () => ({ code: 'medkit' })
            };
            itemRepository.findByPlayer.mockResolvedValue([mockItem]);
            itemDescriptorRepository.findByCode.mockResolvedValue({ _id: 'p1', title: 'Аптечка' });

            const result = await ProductService.getUserInventory('u1');

            expect(itemRepository.findByPlayer).toHaveBeenCalledWith('u1');
            expect(itemDescriptorRepository.findByCode).toHaveBeenCalledWith('medkit');
            expect(result).toEqual([
                { code: 'medkit', descriptor: { _id: 'p1', title: 'Аптечка' } }
            ]);
        });
    });
});
