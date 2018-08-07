import {Base} from '@/api/base';

/**
 * 系统用户的api
 */
export default class WechatUserApi extends Base {
    /**
     * 列表分页查询
     * @param params
     * @param sCallback
     */
    list(pageModel, data, callback) {
        let params = {
            method: 'post',
            url: '/wechat/user/list?currentPage=' + pageModel.currentPage + '&pageSize=' + pageModel.pageSize,
            data: data,
            sCallback: callback
        }
        this.request(params);
    }

    /**
     * 修改积分
     * @param params
     * @param sCallback
     */
    updateIntegral(data, sCallback, eCallback) {
        let params = {
            method: 'post',
            url: '/wechat/user/integral/update',
            data: data,
            sCallback: sCallback,
            eCallback: eCallback
        }
        this.request(params);
    }

    /**
     * 修改积分
     * @param params
     * @param sCallback
     */
    delete(id, sCallback, eCallback) {
        let params = {
            method: 'get',
            url: '/wechat/user/delete/' + id,
            sCallback: sCallback,
            eCallback: eCallback
        }
        this.request(params);
    }
}
