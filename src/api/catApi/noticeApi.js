import request from '@/utils/request'


export function noticeAdd(params) {
    return request({
        url: '/api/sys/notice', //添加公告
        method: 'post',
        params: params
    })
}
export function noticeDelete(id, data) {
    return request({
        url: '/api/sys/notice/' + id, //删除公告
        method: 'post',
        data: data
    })
}
export function noticeList(params) {
    return request({
        url: '/api/sys/notice/list', //获取公告列表
        method: 'get',
        params: params
    })
}

export function noticeEdit(params) {
    return request({
        url: '/api/sys/notice', //修改公告
        method: 'put',
        params: params
    })
}
