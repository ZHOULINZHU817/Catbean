import request from '@/utils/request'


export function bannerAdd(data) {
    return request({
        url: '/api/sys/banner', //添加banner
        method: 'post',
        data: data
    })
}
export function bannerList(params) {
    return request({
        url: '/api/sys/banner/list', //获取banner列表
        method: 'get',
        params: params
    })
}
export function bannerSort(params) {
    return request({
        url: '/api/sys/banner/sort', //修改banner排序
        method: 'post',
        params: params
    })
}

export function bannerStatus(params) {
    return request({
        url: '/api/sys/banner/status', //修改banner状态
        method: 'post',
        params: params
    })
}

export function bannerEdit(data) {
    return request({
        url: '/api/sys/banner', //修改banner状态
        method: 'put',
        data: data
    })
}

export function bannerDetail(params) {
    return request({
        url: '/api/sys/banner', //修改banner详情
        method: 'get',
        params: params
    })
}

