import request from '@/utils/request'


export function teamList(params) {
    return request({
        url: '/api/sys/vip/list', //团队设置
        method: 'get',
        params: params
    })
} 

export function teamEdit(data) {
    return request({
        url: '/api/sys/vip', //团队设置修改
        method: 'put',
        data: data
    })
} 

export function versionList(params) {
    return request({
        url: '/api/sys/version/list', //版本列表
        method: 'get',
        params: params
    })
} 

export function versionSave(data) {
    return request({
        url: '/api/sys/version', //版本发布
        method: 'post',
        data: data
    })
} 

export function callSetting(data) {
    return request({
        url: '/api/sys/setting', //客服管理
        method: 'put',
        data: data
    })
}

export function callSettingList(params) {
    return request({
        url: '/api/sys/setting/list', //客服管理
        method: 'get',
        params: params
    })
}






// export function noticeDelete(id, data) {
//     return request({
//         url: '/api/sys/notice/' + id, //删除公告
//         method: 'delete',
//         data: data
//     })
// }
// export function noticeList(params) {
//     return request({
//         url: '/api/sys/notice/list', //获取公告列表
//         method: 'get',
//         params: params
//     })
// }

// export function noticeEdit(id, data) {
//     return request({
//         url: '/api/sys/notice/'+ id, //修改公告
//         method: 'put',
//         data: data
//     })
// }

// export function noticeDetail(id, params) {
//     return request({
//         url: '/api/sys/notice/'+id, //公告详情
//         method: 'get',
//         params: params
//     })
// }

