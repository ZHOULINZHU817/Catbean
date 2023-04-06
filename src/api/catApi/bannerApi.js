import request from '@/utils/request'


export function bannerAdd(params) {
    return request({
        url: '/api/sys/banner', //添加banner
        method: 'post',
        params: params
    })
}
export function bannerList(params) {
    return request({
        url: '/api/sys/banner/list', //获取banner列表
        method: 'post',
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
