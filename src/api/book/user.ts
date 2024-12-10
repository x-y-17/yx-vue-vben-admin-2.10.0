import { defHttp } from '/@/utils/http/axios';

enum Api {
  GetUserList = '/user',
}

export const getUserList = (params) => {
  console.log(params);
  return defHttp.get({ url: Api.GetUserList, params }, { errorMessageMode: 'none' });
};
