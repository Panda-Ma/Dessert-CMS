import request from "/@/api/request";

export function initGoodTable(){
    return request({
        url:'/cms/good/getAll',
        method:'get'
    })
}


export function addGood(obj:object){
    return request({
        url:'/cms/good/add'
        ,method:'post'
        ,data:obj
    })
}

export function editGood(obj:object){
    return request({
        url:'/cms/good/edit'
        ,method:'post'
        ,data:obj
    })
}



// 获取匹配搜索关键字的Table数据
export function searchInfo(obj:object) {
    return request({
        url: '/cms/good/search',
        method:'get',
        params: obj,
    })
}

export function getList() {
    return request({
        url: '/cms/good/getList',
        method:'get',
    })
}
export function newCategory(obj:object){
    return request({
        url: '/cms/good/category',
        method:'post',
        data:obj
    })
}