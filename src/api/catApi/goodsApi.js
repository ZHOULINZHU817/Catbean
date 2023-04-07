import request from '@/utils/request'


export function productAdd(data) {
    return request({
        url: '/api/sys/product', //添加商品
        method: 'post',
        data: data
    })
}
export function productDetail(id, data) {
    return request({
        url: '/api/sys/product/' + id, //获取商品详情
        method: 'get',
        data: data
    })
}
export function productEdit(id, data) {
    return request({
        url: '/api/sys/product/'+ id, //编辑商品
        method: 'put',
        data: data
    })
}

export function productList(params) {
    return request({
        url: '/api/sys/product/list', //获取商品列表
        method: 'get',
        params: params
    })
}

export function productStatus(data) {
    return request({
        url: '/api/sys/product/status', //上架下架商品
        method: 'put',
        data: data
    })
}

export function productOrderList(params) {
    return request({
        url: '/api/sys/record/product/list', //猫超商品订单列表接口
        method: 'get',
        params: params
    })
}

export function productOrderSend(data) {
    return request({
        url: '/api/sys/manager/record/product/send', //猫超商品订单列表接口
        method: 'put',
        data: data
    })
}



