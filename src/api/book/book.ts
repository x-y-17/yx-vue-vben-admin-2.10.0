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

export const addBook = (data) => {
  return defHttp.post({ url: Api.GetBookList, data }, { errorMessageMode: 'none' });
};

export const deleteBook = (params) => {
  console.log('params', params);
  return defHttp.delete({ url: Api.GetBookList, params });
};

export const deleteContents = (fileName) => {
  return defHttp.delete({ url: '/contents', params: { fileName } });
};
