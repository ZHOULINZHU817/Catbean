import request from '@/utils/request'

export function memberList(params) { //会员列表
    return request({
        // url: '/admin/list',
        url: `/api/sys/manager/member/list`,
        method: 'get',
        params: params
    })
}

export function memberChildList(params) { //下级会员列表
    return request({
        // url: '/admin/list',
        url: `/api/sys/manager/member/child/list`,
        method: 'get',
        params: params
    })
}

export function memberPhone(params) { //根据手机号查询会员
    return request({
        url: `/api/sys/manager/member/phone`,
        method: 'get',
        params: params
    })
}

export function rechargeList(params) { //猫豆充值记录列表
    return request({
        url: `/api/sys/record/recharge/list`,
        method: 'get',
        params: params
    })
}
export function recharge(data) { //猫豆充值接口
    return request({
        url: `/api/sys/asset/recharge`,
        method: 'post',
        data: data
    })
}

export function withdrawList(params) { //猫豆提现记录列表
    return request({
        url: `/api/sys/record/withdraw/list`,
        method: 'get',
        params: params
    })
}

export function assetAudit(data) { //猫豆提现记录->审核
    return request({
        url: `/api/sys/asset/audit`,
        method: 'put',
        data: data
    })
}

export function managerFrozen(data) { //猫豆提现记录->审核
    return request({
        url: `/api/sys/manager/frozen`,
        method: 'put',
        data: data
    })
}
//
export function teamBuyList(params) { //获取团队收益列表
    return request({
        url: `/api/sys/record/total/team/buy/list`,
        method: 'get',
        params: params
    })
}
//回滚充值
export function rechargeDelete(id, data) {
    return request({
        url: '/api/sys/asset/revert/recharge/' + id,
        method: 'delete',
        data: data
    })
}
//充值审核
export function rechargeAudit(data) { //猫豆充值审核
    return request({
        url: `/api/sys/asset/recharge/audit`,
        method: 'put',
        data: data
    })
}
//猫豆扣除
export function catReduce(data) { //猫豆扣除
    return request({
        url: `/api/sys/manager/reduce`,
        method: 'put',
        data: data
    })
}
//
// export function noticeDelete(id, data) {
//     return request({
//         url: '/api/sys/notice/' + id, //删除公告
//         method: 'post',
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

// export function noticeEdit(data) {
//     return request({
//         url: '/api/sys/notice', //修改公告
//         method: 'put',
//         data: data
//     })
// }
