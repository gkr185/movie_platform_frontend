import { ElMessage } from 'element-plus'

// 错误码映射
export const ErrorCodes = {
  400: '请求参数错误',
  401: '未授权或登录已过期',
  403: '访问被禁止',
  404: '请求的资源不存在',
  409: '资源冲突（如用户名已存在）',
  500: '服务器内部错误',
  502: '网关错误',
  503: '服务不可用',
  504: '网关超时'
}

// 业务错误码映射
export const BusinessErrorCodes = {
  USER_NOT_FOUND: '用户不存在',
  INVALID_PASSWORD: '密码错误',
  USERNAME_EXISTS: '用户名已被使用',
  EMAIL_EXISTS: '邮箱已被使用',
  INVALID_TOKEN: '无效的令牌',
  PASSWORD_NOT_MATCH: '两次输入的密码不一致',
  INVALID_OLD_PASSWORD: '原密码错误',
  ACCOUNT_DISABLED: '账号已被禁用',
  VIP_EXPIRED: 'VIP已过期',
  USERNAME_LENGTH_ERROR: '用户名长度必须在3-20个字符之间'
}

// 统一错误处理函数
export function handleError(error, customMessage = '') {
  console.error('API Error:', error)
  
  let errorMessage = customMessage

  if (error.response) {
    // 服务器响应错误
    const { status, data } = error.response
    
    if (data && data.message) {
      // 使用服务器返回的错误信息
      errorMessage = data.message
    } else if (data && data.code && BusinessErrorCodes[data.code]) {
      // 使用业务错误码映射的信息
      errorMessage = BusinessErrorCodes[data.code]
    } else if (ErrorCodes[status]) {
      // 使用HTTP状态码映射的信息
      errorMessage = ErrorCodes[status]
    }
  } else if (error.request) {
    // 请求发送失败
    errorMessage = '网络请求失败，请检查网络连接'
  } else {
    // 其他错误
    errorMessage = error.message || '发生未知错误'
  }

  // 显示错误提示
  ElMessage({
    message: errorMessage,
    type: 'error',
    duration: 5000
  })

  return Promise.reject(error)
}

// 参数验证
export function validateUserData(data, type = 'register') {
  const errors = []

  if (type === 'register' || type === 'login') {
    // 用户名验证
    if (!data.username) {
      errors.push('请输入用户名')
    } else if (data.username.length < 3 || data.username.length > 20) {
      errors.push('用户名长度必须在3-20个字符之间')
    }

    // 密码验证
    if (!data.password) {
      errors.push('请输入密码')
    } else if (data.password.length < 6 || data.password.length > 20) {
      errors.push('密码长度必须在6-20个字符之间')
    }
  }

  if (type === 'register') {
    // 邮箱验证
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/
    if (!data.email) {
      errors.push('请输入邮箱')
    } else if (!emailRegex.test(data.email)) {
      errors.push('邮箱格式不正确')
    }

    // 手机号验证（如果提供）
    if (data.phone) {
      const phoneRegex = /^1[3-9]\d{9}$/
      if (!phoneRegex.test(data.phone)) {
        errors.push('手机号格式不正确')
      }
    }
  }

  if (type === 'changePassword') {
    // 新密码验证
    if (!data.oldPassword) {
      errors.push('请输入原密码')
    }
    if (!data.newPassword) {
      errors.push('请输入新密码')
    } else if (data.newPassword.length < 6 || data.newPassword.length > 20) {
      errors.push('新密码长度必须在6-20个字符之间')
    }
    if (data.newPassword === data.oldPassword) {
      errors.push('新密码不能与原密码相同')
    }
  }

  return errors
} 