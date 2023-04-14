import request from "/@/api/request";

export function getNum(){
    return request({
        url:'/cms/home/getNum',
        method:'get'
    })
}


export function getDessertNum(){
    return request({
        url:'/cms/home/getDessertNum',
        method:'get'
    })
}