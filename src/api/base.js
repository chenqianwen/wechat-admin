import axios from 'axios';
// import {getStore} from './storage';
import {Message} from 'iview';
import {router} from '../router/index';
import {ApiConfig} from './apiConfig';

class Base {
    constructor() {
        // 统一请求路径前缀
        let base = ApiConfig.restUrl;
        // 超时设定
        axios.defaults.timeout = ApiConfig.timeout;
        axios.defaults.baseURL = base;
        axios.interceptors.request.use(config => {
            return config;
        }, err => {
            Message.error('请求超时');
            return Promise.resolve(err);
        });

        // http response 拦截器
        axios.interceptors.response.use(response => {
            const data = response;

            // 根据返回的code值来做不同的处理(和后端约定)
            switch (data.code) {
                case 401:
                    // 未登录 清除已登录状态
                    // Cookies.set('userInfo', '');
                    // setStore('accessToken', '');
                    router.push('/login');
                    break;
                case 403:
                    // 没有权限
                    if (data.message !== null) {
                        Message.error(data.message);
                    } else {
                        Message.error('未知错误');
                    }
                    break;
                case 500:
                    // 错误
                    if (data.message !== null) {
                        Message.error(data.message);
                    } else {
                        Message.error('未知错误');
                    }
                    break;
                default:
                    return data;
            }

            return data;
        }, (err) => { // 这里是返回状态码不为200时候的错误处理
            Message.error(err.toString());
            return Promise.resolve(err);
        });
    }

    request(params) {
        // let accessToken = getStore('accessToken');
        let accessToken = '';
        let method = params.method ? params.method : 'GET'
        let header = {}
        header['accessToken'] = accessToken
        if (method.toUpperCase() === 'POST') {
            header['Content-Type'] = 'application/json;charset=UTF-8';
        }
        axios({
            method: method,
            url: params.url,
            data: params.data,
            headers: header
        }).then(function (response) {
            // 请求成功
            if (response.status === 200) {
                if (response.data.errcode === 0) {
                    params.sCallback && params.sCallback(response.data.data);
                } else {
                    params.sCallback && params.sCallback(response.data);
                }
            }
        }).catch(function (error) {
            if (error.response) {
                console.log('axios请求出错');
                console.log(JSON.stringify(error));
            }
        });
    };
}

export {Base};
