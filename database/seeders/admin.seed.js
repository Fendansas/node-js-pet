import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';

import User from '../../models/user.js';
import Role from '../../models/role.js';

dotenv.config();

const seedAdmin = async () => {

    try {

        await mongoose.connect(process.env.MONGO_URI);

        console.log('Mongo connected');

        // ищем роль admin
        const adminRole = await Role.findOne({
            name: 'admin'
        });

        if (!adminRole) {
            throw new Error('ADMIN_ROLE_NOT_FOUND');
        }

        // проверяем существует ли admin
        const existingAdmin = await User.findOne({
            username: 'admin'
        });

        if (existingAdmin) {
            console.log('Admin already exists');
            process.exit();
        }

        // хешируем пароль
        const hashedPassword = await bcrypt.hash(
            'admin123',
            10
        );

        // создаем admin
        const admin = await User.create({
            username: 'admin',
            email: 'admin@zone.local',
            password: hashedPassword,

            role: adminRole._id,

            bio: 'Zone Administrator',

            rank: 'monolit',

            isVerified: true
        });

        console.log('Admin created');
        console.log(admin);

        process.exit();

    } catch (err) {

        console.error(err);

        process.exit(1);
    }
};

seedAdmin();