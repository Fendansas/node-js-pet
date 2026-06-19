import User from "../models/user.js";

export const updateUserProfileService = async (userId, data)=>{

    const existingUser = await User.findById(userId);

    if (!existingUser) {
        const error = new Error('USER_NOT_FOUND');
        error.code = 'USER_NOT_FOUND';
        throw error;
    }

    if (data.email && data.email !== existingUser.email){
        const existsEmail = await User.findOne({ email: data.email });
        if (existsEmail) {
            const error = new Error('EMAIL_ALREADY_EXISTS');
            error.code = 'EMAIL_ALREADY_EXISTS';
            throw error;
        }
    }

    const user = await User.findByIdAndUpdate (
        userId,
        {
            username: data.username,
            email: data.email,
            bio: data.bio,
            avatar: data.avatar,
            rank: data.rank
        },
        {
            new:true,
            runValidators: true
        }
    ).populate('role');

    return user;

}

export const getProfileService = async (userId) => {
    const user = await User.findById(userId).populate('role').populate('inventory.product');
    if (!user) {
        const error = new Error('USER_NOT_FOUND');
        error.code = 'USER_NOT_FOUND';
        throw error;
    }
    return user;
}

export const getAllUsersService = async () => {
    const users = await User.find().populate('role').populate('inventory.product');
    const onlineUsers = users.filter(user => user.isOnline).length;

    const { Task } = await import('../models/Task.js');

    for (const user of users) {
        const tasks = await Task.find({
            'assignedTo.user': user._id
        });

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
};

export const editProfileService = async (userId) => {
    const user = await User.findById(userId).populate('role');
    if (!user) {
        const error = new Error('USER_NOT_FOUND');
        error.code = 'USER_NOT_FOUND';
        throw error;
    }
    return user;
}