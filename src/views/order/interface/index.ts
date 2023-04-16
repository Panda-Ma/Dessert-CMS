// 通过接口定义对象的类型
export interface IData { //数据类型
    id: Number, // 主键
    userId: Number, // 用户id
    sum: number; // 商品总价
    num: number; // 商品总数
    note:string;  // 备注
    time: string;  // 创建时间
    state: string;  // 进行中/已完成

}

export interface IDialog{
    data:IData
    ,isShowDialog:boolean
    ,goods:Good[]
}
interface Good{
    id:number,
    name:string,
    num:number,
    price:number,
    img:string,
    intro:string,
}