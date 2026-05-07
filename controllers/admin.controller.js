import Role from "../models/role.js";
import Permission from "../models/permission.js";


export const rbacPage = async (req, res) => {
    const roles = await Role.find().populate('permissions');
    const permissions = await Permission.find();
    res.render('admin/rbac', {
        roles,
        permissions
    });
}
export const createPermission = async (req, res) => {
    const {name, description} = req.body;
    await Permission.create({name, description});
    res.redirect('/admin/rbac');
}

export const createRole = async (req, res)=>{
    const {name, permissions} = req.body;

    await Role.create({
        name,
        permissions
    });
    res.redirect('/admin/rbac');
}

export const addPermissionToRole = async (req, res)=>{
    const {roleId, permissionId} = req.body;

    const role = await Role.findById(roleId);

    if (!role.permissions.includes(permissionId)) {
        role.permissions.push(permissionId);
        await role.save();
    }

    res.redirect('/admin/rbac');
}

export const removePermissionFromRole = async (req, res) => {
    const { roleId, permissionId } = req.body;

    const role = await Role.findById(roleId);

    role.permissions = role.permissions.filter(
        p => p.toString() !== permissionId
    );

    await role.save();

    res.redirect('/admin/rbac');
}