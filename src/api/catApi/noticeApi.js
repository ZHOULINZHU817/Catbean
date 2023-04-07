import request from '@/utils/request'


export function noticeAdd(data) {
    return request({
        url: '/api/sys/notice', //添加公告
        method: 'post',
        data: data
    })
}
export function noticeDelete(id, data) {
    return request({
        url: '/api/sys/notice/' + id, //删除公告
        method: 'delete',
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

export function noticeEdit(data) {
    return request({
        url: '/api/sys/notice', //修改公告
        method: 'put',
        data: data
    })
}

export function noticeDetail(id, params) {
    return request({
        url: '/api/sys/notice/'+id, //公告详情
        method: 'get',
        params: params
    })
}

