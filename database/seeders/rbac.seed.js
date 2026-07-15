import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import Permission from "../../models/Permission.js";
import Role from "../../models/Role.js";

// Connect to database
await mongoose.connect(process.env.MONGO_URI);
console.log('Connected to MongoDB');

// Полный список прав доступа
const permissionsList = [
    // Пользователи
    'user:create', 'user:read', 'user:update', 'user:delete',
    // Роли и права (RBAC)
    'role:create', 'role:read', 'role:update', 'role:delete',
    'permission:create', 'permission:read', 'permission:update',
    // Продукты
    'product:read', 'product:create', 'product:update', 'product:delete',
    'product:buy', 'product:inventory',
    // Посты
    'post:read', 'post:create', 'post:update', 'post:delete',
    // События
    'event:read', 'event:create', 'event:update', 'event:delete',
    // Задачи
    'task:read', 'task:create', 'task:update', 'task:delete', 'task:assign',
    // Аномалии
    'anomaly:read', 'anomaly:create', 'anomaly:update', 'anomaly:delete',
    'anomaly:export',
    // Оверлеи (изображения на карте)
    'overlay:read', 'overlay:create', 'overlay:update', 'overlay:delete',
    // Админка и Профиль
    'dashboard:read', 'rbac:manage',
    'profile:read', 'profile:update', 'avatar:manage',
    // коменты
    'comment:create', 'comment:read', 'comment:delete'
];

const create = async () => {
    try {
        // 1. Создаем или обновляем Permissions
        const createdPermissions = [];
        for (const name of permissionsList) {
            const perm = await Permission.findOneAndUpdate(
                { name },
                { name, description: `Permission for ${name}` },
                { upsert: true, returnDocument: 'after' }
            );
            createdPermissions.push(perm);
        }
        console.log(`Permissions updated: ${createdPermissions.length}`);

        // 2. Role: Admin (все права)
        const adminRole = await Role.findOneAndUpdate(
            { name: 'admin' },
            { 
                name: 'admin',
                permissions: createdPermissions 
            },
            { upsert: true, returnDocument: 'after' }
        );
        console.log('Admin role updated with all permissions');

        // 3. Role: User (базовые права)
        const userPermissions = createdPermissions.filter(p => 
            ['product:read', 'post:read', 'event:read', 'task:read', 
             'anomaly:read', 'overlay:read',
             'profile:read', 'profile:update', 'avatar:manage',
             'comment:create', 'comment:read'].includes(p.name)
        );
        
        const userRole = await Role.findOneAndUpdate(
            { name: 'user' },
            { 
                name: 'user',
                permissions: userPermissions 
            },
            { upsert: true, returnDocument: 'after' }
        );
        console.log('User role created/updated with basic permissions');

        console.log('Seed done successfully');
    } catch (error) {
        console.error('Seed error:', error);
    } finally {
        mongoose.connection.close();
    }
};

create();