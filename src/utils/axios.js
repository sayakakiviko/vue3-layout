import Axios from 'axios';
import Qs from 'qs';

// const baseURL = 'https://api.uomg.com/';
const axios = Axios.create({
  // baseURL,
  timeout: 20000, // 请求超时 20s
  headers: {
    'Content-Type': 'application/json',
    // 'Content-Type': 'application/x-www-form-urlencoded',
    // token: 123,
  },
});

// 请求拦截器（发起请求之前的拦截）
axios.interceptors.request.use(
  (config) => {
    // 关于formData入参的处理
    config.headers['Content-Type'] === 'application/x-www-form-urlencoded' &&
      (config.data = Qs.stringify(config.data));
    /**
     * 根据你的项目实际情况来对 config 做处理
     * 这里没有对 config 不做任何处理，直接返回
     */
    // 这里还可以添加token等等
    // config.headers['Authorization'] = getToken()
    return config;
  },
  (error) => Promise.reject(error),
);

// 响应拦截器（获取到响应时的拦截）
axios.interceptors.response.use(
  (response) => {
    // const { code, data, message } = response.data;
    // if (code === 200) return data;
    // else if (code === 401) {
    //   // jumpLogin();
    // } else {
    //   Message.error(message);
    //   return Promise.reject(response.data);
    // }
    /**
     * 根据你的项目实际情况来对 response 和 error 做处理
     * 这里对 response 和 error 不做任何处理，直接返回
     */
    if (response.data.success) {
      return response.data;
    }

    return response.data;
  },
  (error) => {
    if (error.response && error.response.data) {
      const code = error.response.status;
      const msg = error.response.data.message;
      window.$message.error(`Code: ${code}, Message: ${msg}`);
      console.error('[Axios Error]', error.response);
    } else {
      window.$message.error(`${error}`);
    }
    return Promise.reject(error);
  },
);

/**
 * get请求方式
 * @url {string} 请求的接口路径
 * @params {object} 入参
 * @options {object} 通常是headers里的一些特殊处理
 * */
const get = (url, params, options) => {
  return axios({
    url,
    method: 'get',
    params,
    ...options,
  });
};

/**
 * post请求方式
 * @url {string} 请求的接口路径
 * @data {object} 入参
 * @options {object} 通常是headers里的一些特殊处理
 * */
const post = (url, data, options) => {
  return axios({
    url,
    method: 'post',
    data,
    ...options,
  });
};

export { get, post };
