import dotenv from 'dotenv';
dotenv.config();

import crypto from 'crypto';
import mongoose from 'mongoose';
import Permission from "../../models/permission.js";
import Role from "../../models/role.js";

// Connect to database
await mongoose.connect(process.env.MONGO_URI);
console.log('Connected to MongoDB');

const permissions= [
    'user:create',
    'user:read',
    'user:update',
    'user:delete',
    'role:create',
    'role:read',
    'role:update',
    'permission:create'
];

const create = async () => {
    try {
        const perm = await Promise.all(
            permissions.map(name =>
                Permission.create({name}))
        );

        const adminRole = await Role.create({
            name: 'admin',
            permissions: perm
        });
        console.log('Seed done');
    } catch (error) {
        console.error('Seed error:', error);
    }
    process.exit();
};

create();