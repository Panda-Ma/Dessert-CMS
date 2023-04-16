// 通过接口定义对象的类型
export interface IData { //数据类型
    id: Number, // 主键
    listId: Number, // 种类id
    name: string; // 商品名
    img: string; // 封面
    intro:string;  // 介绍
    price: number; // 单价
    list: string;  // 种类名称
    state: string;  // 上架/下架

}

export interface IDialog{
    data:IData
    ,isShowDialog:boolean
    ,list:List[]
}
interface List{
    name:string,
    id:number
}