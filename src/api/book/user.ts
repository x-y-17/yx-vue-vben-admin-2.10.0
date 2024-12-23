import { defHttp } from '/@/utils/http/axios';

enum Api {
  GetUserList = '/user',
}

export const getUserList = (params) => {
  if (params.userName) {
    params.username = params.userName;
    delete params.userName;
  }

  return defHttp.get({ url: Api.GetUserList, params });
};

export const addUser = (params) => {
  return defHttp.post({ url: Api.GetUserList, params });
};

export const updateUser = (params) => {
  return defHttp.put({ url: Api.GetUserList, params });
};

export const deleteUser = (params) => {
  return defHttp.delete({ url: Api.GetUserList, params });
};
