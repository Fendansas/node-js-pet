
import * as RbacService from "../services/rbac.service.js";


export const rbacPage = async (req, res) => {
    const data = await RbacService.getRbacPageData();
    res.render('admin/rbac', data);
}
export const createPermission = async (req, res) => {

    const {name, description} = req.body;

    await RbacService.createPermission(name, description);

    res.redirect('/admin/rbac');
}

export const createRole = async (req, res)=>{

    const {name} = req.body;

    await RbacService.createRole(name);

    res.redirect('/admin/rbac');
}

export const addPermissionToRole = async (req, res)=>{

    const {roleId, permissionId} = req.body;

    await RbacService.addPermissionToRole(roleId, permissionId);

    res.redirect('/admin/rbac');
}

export const removePermissionFromRole = async (req, res) => {

    const { roleId, permissionId } = req.body;

    await RbacService.removePermissionFromRole(roleId, permissionId);

    res.redirect('/admin/rbac');
}