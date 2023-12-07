import { get, post } from '@/utils/axios';

const demo = {
  //get params传参
  getUserName(param, config) {
    return get(`/m1/1271886-0-default/getUser/${param}`, null, config); //params传参时，接口若需要配置config，则需要用null做param的占位符
  },
  //post传参
  addUserName(param, config) {
    return post(`/m1/1271886-0-default/addUser`, param, config);
  },
  //query传参
  getData(param, config) {
    return get('/api/get.favicon', param, config);
  },
  //query传参
  getList(param, config) {
    return get('/m1/1271886-0-default/getList', param, config);
  },
  //post传参
  postTest(param, config) {
    return post('/api/get.favicon', param, config);
  },
};

export default demo;
