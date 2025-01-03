import { defHttp } from '/@/utils/http/axios';

enum Api {
  Role = '/role',
  RoleMenu = '/role/role_menu',
}

export const getRoleList = (params = {}) => {
  return defHttp.get({ url: Api.Role, params });
};

export const addRole = (params) => {
  return defHttp.post({ url: Api.Role, params });
};

export const updateRole = (params) => {
  return defHttp.put({ url: Api.Role, params });
};

export const deleteRole = (params) => {
  return defHttp.delete({ url: Api.Role, params: { name: params.name } });
};

export const addRoleMenu = (data) => {
  return defHttp.post({ url: Api.RoleMenu, data });
};

export const getRoleMenu = (params) => {
  return defHttp.get({ url: Api.RoleMenu, params });
};

export const updateRoleMenu = (params) => {
  return defHttp.put({ url: Api.RoleMenu, params });
};

export const deleteRoleMenuByRoleId = (params) => {
  return defHttp.delete({ url: Api.RoleMenu, params: { roleId: params.roleId } });
};
