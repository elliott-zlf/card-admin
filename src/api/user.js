import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/vue-admin-template/user/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/vue-admin-template/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/vue-admin-template/user/logout',
    method: 'post'
  })
}
// 配音师列表
export function teacherList(data) {
  return request({
    url: '/teacher/list',
    method: 'post',
    data
  })
}
// 操作
// 配音师列表
export function teacherBan(data) {
  return request({
    url: '/teacher/ban',
    method: 'post',
    data
  })
}
// 入库
export function teacherWare(data) {
  return request({
    url: '/teacher/ware',
    method: 'post',
    data
  })
}
// 置顶
export function teacherTop(data) {
  return request({
    url: '/teacher/top',
    method: 'post',
    data
  })
}
export function profileData(data) {
  return request({
    url: '/profile/data',
    method: 'post',
    data
  })
}
// 服务列表
export function serviceList(data) {
  return request({
    url: '/service/list',
    method: 'post',
    data
  })
}
// 作品列表
export function serviceWorkList(data) {
  return request({
    url: '/service/work/list',
    method: 'post',
    data
  })
}
// 删除服务
export function servicedelete(data) {
  return request({
    url: '/service/delete',
    method: 'post',
    data
  })
}
