import request from '@/utils/request'

// 标签库管理
export function tagAll(data) {
  return request({
    url: '/tag/all',
    method: 'post',
    data
  })
}
// 获取配音师信息
export function teacherShow(data) {
  return request({
    url: '/teacher/show',
    method: 'post',
    data
  })
}
// 保存配音师消息
export function teacherupdate(data) {
  return request({
    url: 'teacher/update',
    method: 'post',
    data
  })
}
// 服务详情
export function serviceshow(data) {
  return request({
    url: '/service/show',
    method: 'post',
    data
  })
}
// 编辑作品
export function workUpdate(data) {
  return request({
    url: '/teacher/work/update',
    method: 'post',
    data
  })
}
// 删除作品
export function serviceworkdel(data) {
  return request({
    url: '/service/workdel',
    method: 'post',
    data
  })
}
// 编辑服务
export function serviceupdate(data) {
  return request({
    url: '/service/update',
    method: 'post',
    data
  })
}
