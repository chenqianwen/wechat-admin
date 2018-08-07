class ApiConfig {
}
const REST_URL = 'http://localhost:8083';
// 后端的接口地址
ApiConfig.restUrl = REST_URL;
// 请求头中存放token的参数名
ApiConfig.tokenParamName = 'accessToken';
// 请求默认时间
ApiConfig.timeout = 20000;

export {ApiConfig};
