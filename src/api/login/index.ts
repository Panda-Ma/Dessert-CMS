import request from '/@/api/request.ts';

// 登陆接口
/**
 *
 * @param obj 请求参数
 */
export function signIn(obj:object) {
    return request({
        url: '/cms/login',
        method: 'post',
        data: obj,
        // withCredentials:false
    });
}
