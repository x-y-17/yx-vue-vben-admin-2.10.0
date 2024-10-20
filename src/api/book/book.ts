import { defHttp } from '/@/utils/http/axios';

enum Api {
  GetBookList = '/book',
}

/**
 * @description: Get user menu based on id
 */

export const getBookList = (params) => {
  return defHttp.get({ url: Api.GetBookList, params });
};

export const deleteBook = (params) => {
  console.log('params', params);
  return defHttp.delete({ url: Api.GetBookList, params });
};
