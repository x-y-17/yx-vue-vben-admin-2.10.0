import { defHttp } from '/@/utils/http/axios';

enum Api {
  GetUserList = '/user',
  Role = '/role',
  RoleMenu = '/role/role_menu',
}

export const getUserList = (params) => {
  if (params.userName) {
    params.username = params.userName;
    delete params.userName;
  }
  console.log(params);

  return defHttp.get({ url: Api.GetUserList, params });
};

export const addUser = (params) => {
  console.log(params);
  return defHttp.post({ url: Api.GetUserList, params });
};

export const updateUser = (params) => {
  console.log(params);
  return defHttp.put({ url: Api.GetUserList, params });
};

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
