import request from '@/utils/request'

export function login(username, password) {
  return request({
    // url: '/admin/login',
    url: '/api/sys/manager/login',
    method: 'post',
    data: {
      phone: username,
      pwd: password
    }
  })
}

export function getInfo() {
  return request({
    // url: '/admin/info',//
    url: '/api/sys/manager', //获取管理员&菜单权限
    method: 'get',
  })
}

export function logout() {
  return request({
    // url: '/admin/logout',
    url: '/api/sys/manager/logout',
    method: 'post'
  })
}

export function getAdminList(params) {
  return request({
    // url: '/admin/list',
     url: '/api/sys/manager/list',
    method: 'get',
    params: params
  })
}

export function getTreeList(params) {
  return request({
    // url: '/admin/list',
     url: '/api/sys/permission/tree/list',
    method: 'get',
    params: params
  })
}

export function getAssignPermissions(id,data) { //账号权限修改
  return request({
    // url: '/admin/list',
     url: `/api/sys/manager/${id}/assign/permissions`,
    method: 'put',
    data: data
  })
}

export function getHavePermissions(id,params) { //账号权限查询
  return request({
    // url: '/admin/list',
     url: `/api/sys/manager/${id}/have/permissions`,
    method: 'get',
    params: params
  })
}

export function memberList(params) { //会员列表
  return request({
    // url: '/admin/list',
     url: `/api/sys/manager/member/list`,
    method: 'get',
    params: params
  })
}

export function memberPhone(params) { //根据手机号查询会员
  return request({
    // url: '/admin/list',
     url: `/api/sys/manager/member/phone`,
    method: 'get',
    params: params
  })
}





// export function createAdmin(data) {
//   return request({
//     url: '/admin/register',
//     method: 'post',
//     data: data
//   })
// }

// export function updateAdmin(id, data) {
//   return request({
//     url: '/admin/update/' + id,
//     method: 'post',
//     data: data
//   })
// }

// export function updateStatus(id, params) {
//   return request({
//     url: '/admin/updateStatus/' + id,
//     method: 'post',
//     params: params
//   })
// }

// export function deleteAdmin(id) {
//   return request({
//     url: '/admin/delete/' + id,
//     method: 'post'
//   })
// }

// export function getRoleByAdmin(id) {
//   return request({
//     url: '/admin/role/' + id,
//     method: 'get'
//   })
// }

// export function allocRole(data) {
//   return request({
//     url: '/admin/role/update',
//     method: 'post',
//     data: data
//   })
// }
