import User from "../models/user.js";

export const hasPermission = async (userId, permissionName) => {

    const user = await User.findById(userId)
        .populate({
           path: 'role',
           populate: {
            path: 'permissions'
           }
        });
    if (!user || !user.role) return false;

    return user.role.permissions.some(
        (p) => p.name === permissionName
    );

}
