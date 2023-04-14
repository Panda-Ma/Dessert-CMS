import request from "/@/api/request";

export function initGoodTable(){
    return request({
        url:'/cms/good/getAll',
        method:'get'
    })
}


export function addTeacher(obj:object){
    return request({
        url:'/teacher/add'
        ,method:'post'
        ,data:obj
    })
}

export function editTeacher(obj:object){
    return request({
        url:'/teacher/updateInfo'
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