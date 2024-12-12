import { defHttp } from '/@/utils/http/axios';

enum Api {
  GetUserList = '/user',
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
