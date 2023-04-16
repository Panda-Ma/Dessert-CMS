// 通过接口定义对象的类型
export interface IData { //数据类型
    id: number, // 主键
    userId: number, // 兑换人id
    code: string; // 优惠卷卷码
    isValid: boolean; // 是否有效
    limit:number;  // 额度
}