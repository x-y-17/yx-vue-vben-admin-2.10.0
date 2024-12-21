import { defHttp } from '/@/utils/http/axios';
import { getMenuListResultModel } from '../sys/model/menuModel';

enum Api {
  GetMenuList = '/getMenuList',
  GetAllMenu = '/menu/active',
  CreateMenu = '/menu',
  UpdateMenu = '/menu',
  GetContentsList = '/contents',
  DeleteContents = '/contents',
}

/**
 * @description: Get user menu based on id
 */

export const getMenuList = () => {
  return defHttp.get<getMenuListResultModel>({ url: Api.GetAllMenu });
};

export const getActiveMenu = () => {
  return defHttp.get({ url: Api.GetAllMenu });
};

export const createMenu = (data) => {
  return defHttp.post({ url: Api.CreateMenu, data });
};

export const updateMenu = (data) => {
  return defHttp.put({ url: Api.UpdateMenu, data });
};

export const addContents = (data) => {
  return defHttp.post({ url: Api.GetContentsList, data }, { errorMessageMode: 'none' });
};

export const deleteContents = (fileName) => {
  return defHttp.delete({ url: Api.DeleteContents, params: { fileName } });
};
