import User from "../models/user.js";
import Permission from "../models/permission.js";
import Role from "../models/role.js";

export const getRbacPageData = async () => {

    const roles = await Role.find().populate('permissions');

    const permissions = await Permission.find();

    return {roles, permissions};
};

export const createPermission = async (name, description) => {

    const existing = await Permission.findOne({ name })

    if (existing) {
        const error = new Error('PERMISSION_ALREADY_EXISTS');
        error.code = 'PERMISSION_ALREADY_EXISTS';
        throw error;
    }
    return await Permission.create({
        name,
        description: description || ''
    });
};

export const createRole = async (name) => {

    const existing = await Role.findOne({ name });
    if (existing) {
        const error = new Error('ROLE_ALREADY_EXISTS');
        error.code = 'ROLE_ALREADY_EXISTS';
        throw error;
    }
    return await Role.create({
        name,
        permissions: []
    });
};

export const addPermissionToRole = async (roleId, permissionId) => {
    return await Role.findByIdAndUpdate(
        roleId,
        {
            $addToSet: {
                permissions: permissionId
            }
        }
    );
};

export const removePermissionFromRole = async (
    roleId,
    permissionId
) =>{
  return await Role.findByIdAndUpdate(
      roleId,
      {
          $pull: {
              permissions: permissionId
          }
      }
  )
};

export const hasPermission = async (
    userId,
    permissionName
) => {

    const user = await User.findById(userId)
        .populate({
           path: 'role',
           populate: {
            path: 'permissions'
           }
        });
    if (!user) {
        return false;
    }
    if (!user.role){
        return false;
    }

    if (!user.role.permissions) {
        return false;
    }

    return user.role.permissions.some(
        (permission) => permission.name === permissionName
    );

}
