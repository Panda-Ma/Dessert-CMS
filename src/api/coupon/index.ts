import request from "/@/api/request";

export const initCouponTable=()=>{
    return request({
        url:'/cms/coupon/getAll',
        method: 'get',
    })
}

export function searchInfo(obj: object) {
    return request({
        url: '/cms/coupon/search',
        method: 'get',
        params: obj,
    })
}
export function addCoupon(obj:object){
    return request({
        url:'/cms/coupon/add'
        ,method:'post'
        ,data:obj
    })
}