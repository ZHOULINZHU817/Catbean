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




