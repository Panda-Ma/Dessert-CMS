import request from "/@/api/request";

export function initOrderTable() {
    return request({
        url: '/cms/order/getAll',
        method: 'get'
    })
}


export function editOrder(obj: object) {
    return request({
        url: '/cms/order/edit'
        , method: 'post'
        , data: obj
    })
}


// 获取匹配搜索关键字的Table数据
export function searchInfo(obj: object) {
    return request({
        url: '/cms/order/search',
        method: 'get',
        params: obj,
    })
}

export function searchIncomplete() {
    return request({
        url: '/cms/order/searchIncomplete',
        method: 'get',
    })
}

export function getDetail(obj:object) {
    return request({
        url: '/order/getOrderDetail',
        method: 'get',
        params:obj
    })
}