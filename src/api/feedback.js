import axios from 'axios'

// 创建用户反馈
export const createFeedback = (feedbackData) => {
  const formData = new FormData()
  formData.append('userId', feedbackData.userId)
  formData.append('content', feedbackData.content)
  formData.append('type', feedbackData.type)
  formData.append('contact', feedbackData.contact)
  formData.append('status', feedbackData.status || 0)

  return axios.post('/feedback/create', formData, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

// 获取用户的反馈历史
export const getUserFeedbackHistory = (userId) => {
  return axios.get(`/feedback/user/${userId}`)
}

// 获取反馈列表（管理员用）- 支持分页和过滤
export const getFeedbackList = (params = {}) => {
  return axios.get('/feedback/list', { params })
}

// 根据反馈类型获取反馈列表
export const getFeedbackByType = (type) => {
  return axios.get(`/feedback/type/${type}`)
}

// 根据状态获取反馈列表
export const getFeedbackByStatus = (status) => {
  return axios.get(`/feedback/status/${status}`)
}

// 处理反馈（管理员用）
export const processFeedback = (processData) => {
  const formData = new FormData()
  formData.append('feedbackId', processData.feedbackId)
  formData.append('status', processData.status)
  if (processData.reply) {
    formData.append('reply', processData.reply)
  }

  return axios.post('/feedback/process', formData, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

// 反馈类型映射
export const FEEDBACK_TYPES = {
  1: '功能建议',
  2: 'Bug反馈',
  3: '内容问题',
  4: '其他'
}

// 反馈状态映射
export const FEEDBACK_STATUS = {
  0: '待处理',
  1: '处理中',
  2: '已处理',
  3: '已关闭'
}

// 获取反馈类型标签颜色
export const getTypeTagType = (type) => {
  const typeMap = {
    1: 'success',    // 功能建议 - 绿色
    2: 'danger',     // Bug反馈 - 红色
    3: 'warning',    // 内容问题 - 橙色
    4: 'info'        // 其他 - 蓝色
  }
  return typeMap[type] || 'info'
}

// 获取状态标签颜色
export const getStatusTagType = (status) => {
  const statusMap = {
    0: 'warning',    // 待处理 - 橙色
    1: 'primary',    // 处理中 - 蓝色
    2: 'success',    // 已处理 - 绿色
    3: 'info'        // 已关闭 - 灰色
  }
  return statusMap[status] || 'info'
} 