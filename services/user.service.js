import userRepository from '../repositories/user.repository.js';
import taskRepository from '../repositories/task.repository.js';

class UserService {

    async updateProfile(userId, data) {

        const existingUser = await userRepository.findById(userId);

        if (!existingUser) {
            const error = new Error('USER_NOT_FOUND');
            error.code = 'USER_NOT_FOUND';
            throw error;
        }

        if (data.email && data.email !== existingUser.email) {
            const existsEmail = await userRepository.findByEmail(data.email);
            if (existsEmail) {
                const error = new Error('EMAIL_ALREADY_EXISTS');
                error.code = 'EMAIL_ALREADY_EXISTS';
                throw error;
            }
        }

        return await userRepository.update(userId, {
            username: data.username,
            email: data.email,
            bio: data.bio,
            avatar: data.avatar,
            rank: data.rank
        });
    }

    async getProfile(userId) {
        const user = await userRepository.findWithRole(userId);
        if (!user) {
            const error = new Error('USER_NOT_FOUND');
            error.code = 'USER_NOT_FOUND';
            throw error;
        }
        return user;
    }

    async getAll(search = '') {
        const users = await userRepository.findByFilter(search);
        const onlineUsers = users.filter(user => user.isOnline).length;

        for (const user of users) {
            const tasks = await taskRepository.findByAssignedUser(user._id);

            let total = 0;
            let completed = 0;

            for (const task of tasks) {
                const assignment = task.assignedTo.find(
                    a => a.user.toString() === user._id.toString()
                );
                if (assignment) {
                    total++;
                    if (assignment.status === 'completed') {
                        completed++;
                    }
                }
            }

            user.taskStats = { total, completed };
        }

        return { users, onlineUsers };
    }

    async getEditProfile(userId) {
        const user = await userRepository.findWithRole(userId);
        if (!user) {
            const error = new Error('USER_NOT_FOUND');
            error.code = 'USER_NOT_FOUND';
            throw error;
        }
        return user;
    }

}

export default new UserService();
