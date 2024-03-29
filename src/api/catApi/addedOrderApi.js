import request from '@/utils/request'


export function saleOrder(data) {
    return request({
        url: '/api/sys/saleOrder', //添加抢购商品
        method: 'post',
        data: data
    })
}
export function saleOrderEdit(id, data) {
    return request({
        url: '/api/sys/saleOrder/'+ id, //编辑抢购商品
        method: 'put',
        data: data
    })
}

export function saleOrderList(params) {
    return request({
        url: '/api/sys/saleOrder/list', //获取抢购商品列表
        method: 'get',
        params: params
    })
}
export function recordBuyList(params) {
    return request({
        url: '/api/sys/record/buy/list', //获取抢购商品记录
        method: 'get',
        params: params
    })
}
export function reserveList(params) {
    return request({
        url: '/api/sys/record/reserve/list', //获取抢购预约记录
        method: 'get',
        params: params
    })
}

export function catFoodList(params) {
    return request({
        url: '/api/sys/record/cat/food/list', //获取猫豆记录
        method: 'get',
        params: params
    })
}


export function transferList(params) {
    return request({
        url: '/api/sys/record/transfer/list', //获取转赠记录
        method: 'get',
        params: params
    })
}



