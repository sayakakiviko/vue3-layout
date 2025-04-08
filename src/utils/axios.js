import Axios from 'axios';
import Qs from 'qs';

/**
 * @description 添加请求信息 **/
const pendingRequest = new Map(); //请求队列
const pendingMethod = {
  /**
   * @description 函数返回唯一的请求key
   * **/
  getRequestKey(config) {
    let { method, url, params, data } = config;
    // axios中取消请求及阻止重复请求的方法
    // 参数相同时阻止重复请求：
    // return [method, url, JSON.stringify(params), JSON.stringify(data)].join("&");
    // 请求方法相同，参数不同时阻止重复请求
    return [method, url].join('&');
  },
  /**
   * @description 请求添加到队列
   * **/
  addPendingRequest(config) {
    let requestKey = pendingMethod.getRequestKey(config);
    config.cancelToken =
      config.cancelToken ||
      new Axios.CancelToken((cancel) => {
        !pendingRequest.has(requestKey) && pendingRequest.set(requestKey, cancel);
      });
  },
  /**
   * @description 取消重复请求
   * **/
  removePendingRequest(config) {
    let requestKey = pendingMethod.getRequestKey(config);
    if (pendingRequest.has(requestKey)) {
      // 如果是重复的请求，则执行对应的cancel函数
      let cancel = pendingRequest.get(requestKey);
      cancel(requestKey);
      // 将前一次重复的请求移除
      pendingRequest.delete(requestKey);
    }
  },
};

/**
 * 封装是请求方法
 * @axiosConfig {object} axios原本的一些配置
 * @cancelRepeatRequest {boolean} 重复的请求是否取消。默认true取消重复的请求，若接口盱眙重复请求该值传false
 * */
const request = (axiosConfig, cancelRepeatRequest = true) => {
  const axios = Axios.create({
    // baseURL: 'https://api.uomg.com/',
    timeout: 20000, // 请求超时 20s
    headers: {
      'Content-Type': 'application/json', //'application/x-www-form-urlencoded',
      // token: 123,
    },
  });

  // 请求拦截器（发起请求之前的拦截）
  axios.interceptors.request.use(
    (config) => {
      pendingMethod.removePendingRequest(config); // 检查是否存在重复请求，若存在则取消已发的请求
      cancelRepeatRequest && pendingMethod.addPendingRequest(config); // 把当前请求信息添加到pendingRequest对象中

      // 关于formData入参的处理
      config.headers['Content-Type'] === 'application/x-www-form-urlencoded' &&
        (config.data = Qs.stringify(config.data));
      /**
       * 根据你的项目实际情况来对 config 做处理
       * 这里没有对 config 不做任何处理，直接返回
       */
      // config.headers['Authorization'] = localStorage.getItem('token');// 这里还可以添加token等
      return config;
    },
    (error) => Promise.reject(error),
  );

  // 响应拦截器（获取到响应时的拦截）
  axios.interceptors.response.use(
    (response) => {
      pendingMethod.removePendingRequest(response.config); //移除重复请求

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
      // if (response.data.success) {
      //   return response.data;
      // }

      return response.data;
    },
    (error) => {
      // 从pendingRequest对象中移除请求
      pendingMethod.removePendingRequest(error.config || {});
      if (Axios.isCancel(error)) {
        console.log('被取消的重复请求：' + error.message);
        return Promise.reject(error);
      }

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
  return axios(axiosConfig);
};

/**
 * get请求方式
 * @url {string} 请求的接口路径
 * @params {object} 入参
 * @options {object} 通常是headers里的一些特殊处理
 * @cancelRepeatRequest {boolean} 重复的请求是否取消。默认true取消重复的请求，若接口盱眙重复请求该值传false
 * */
export const get = (url, params, options, cancelRepeatRequest) => {
  return request(
    {
      method: 'get',
      url,
      params,
      ...options,
    },
    cancelRepeatRequest,
  );
};
/**
 * post请求方式
 * @url {string} 请求的接口路径
 * @params {object} 入参
 * @options {object} 通常是headers里的一些特殊处理
 * @cancelRepeatRequest {boolean} 重复的请求是否取消。默认true取消重复的请求，若接口盱眙重复请求该值传false
 * */
export const post = (url, params, options, cancelRepeatRequest) => {
  return request(
    {
      method: 'post',
      url,
      data: params,
      ...options,
    },
    cancelRepeatRequest,
  );
};
/**
 * 下载
 * @url {string} 请求的接口路径
 * @params {object} 入参
 * @options {object} 通常是headers里的一些特殊处理
 * @cancelRepeatRequest {boolean} 重复的请求是否取消。默认true取消重复的请求，若接口盱眙重复请求该值传false
 */
export const download = (url, params, options, cancelRepeatRequest) => {
  return request(
    {
      method: 'post',
      responseType: 'blob',
      url,
      data: params,
      ...options,
    },
    cancelRepeatRequest,
  );
};
