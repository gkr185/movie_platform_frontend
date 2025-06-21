import request from '@/utils/request'
import { API_URLS } from './config'
import { handleError, validateUserData } from '@/utils/error-handler'

const { USER } = API_URLS

// 用户注册
export async function register(data) {
  try {
    // 参数验证
    const errors = validateUserData(data, 'register')
    if (errors.length > 0) {
      throw new Error(errors.join('\n'))
    }

    console.log('发送注册请求:', data)
    const response = await request({
      url: USER.REGISTER,
      method: 'post',
      data
    })
    console.log('注册API响应:', response)
    return response
  } catch (error) {
    return handleError(error, '注册失败')
  }
}

// 用户登录
export async function login(data) {
  try {
    // 参数验证
    const errors = validateUserData(data, 'login')
    if (errors.length > 0) {
      throw new Error(errors.join('\n'))
    }

    console.log('发送登录请求:', data)
    const response = await request({
      url: USER.LOGIN,
      method: 'post',
      data
    })
    console.log('登录API响应:', response)
    return response
  } catch (error) {
    return handleError(error, '登录失败')
  }
}

// 用户登出
export async function logout() {
  try {
    console.log('发送登出请求')
    const response = await request({
      url: USER.LOGOUT,
      method: 'post'
    })
    console.log('登出API响应:', response)
    return response
  } catch (error) {
    return handleError(error, '登出失败')
  }
}

// 获取当前用户信息
export async function getCurrentUser() {
  try {
    console.log('获取当前用户信息')
    const response = await request({
      url: USER.CURRENT,
      method: 'get'
    })
    console.log('当前用户信息API响应:', response)
    return response
  } catch (error) {
    console.error('获取当前用户信息API错误:', error)
    return handleError(error, '获取用户信息失败')
  }
}

// 检查登录状态
export async function checkLoginStatus() {
  try {
    console.log('检查登录状态')
    const response = await request({
      url: USER.LOGIN_STATUS,
      method: 'get'
    })
    console.log('登录状态检查响应:', response)
    return response
  } catch (error) {
    console.error('检查登录状态失败:', error)
    return handleError(error, '检查登录状态失败')
  }
}

// 获取用户信息（通过ID）
export async function getUserInfo(userId) {
  try {
    if (!userId) {
      throw new Error('用户ID不能为空')
    }

    console.log('请求用户信息, userId:', userId)
    const response = await request({
      url: USER.PROFILE.replace('{userId}', userId),
      method: 'get'
    })
    console.log('用户信息API响应:', response)
    return response
  } catch (error) {
    console.error('获取用户信息API错误:', error)
    return handleError(error, '获取用户信息失败')
  }
}

// 更新个人资料
export async function updateProfile(data) {
  try {
    // 验证必填字段
    if (data.email) {
      const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/
      if (!emailRegex.test(data.email)) {
        throw new Error('邮箱格式不正确')
      }
    }

    if (data.phone) {
      const phoneRegex = /^1[3-9]\d{9}$/
      if (!phoneRegex.test(data.phone)) {
        throw new Error('手机号格式不正确')
      }
    }

    console.log('更新个人资料:', data)
    const response = await request({
      url: USER.PROFILE_UPDATE,
      method: 'put',
      data
    })
    console.log('更新个人资料API响应:', response)
    return response
  } catch (error) {
    return handleError(error, '更新个人资料失败')
  }
}

// 修改密码
export async function changePassword(data) {
  try {
    if (!data.oldPassword || !data.newPassword) {
      throw new Error('原密码和新密码不能为空')
    }

    if (data.newPassword.length < 6 || data.newPassword.length > 20) {
      throw new Error('新密码长度必须在6-20个字符之间')
    }

    console.log('修改密码请求')
    const response = await request({
      url: USER.CHANGE_PASSWORD,
      method: 'put',
      params: {
        oldPassword: data.oldPassword,
        newPassword: data.newPassword
      }
    })
    console.log('修改密码API响应:', response)
    return response
  } catch (error) {
    return handleError(error, '修改密码失败')
  }
}

// 检查用户名是否可用
export async function checkUsername(username) {
  try {
    if (!username) {
      throw new Error('请输入用户名')
    }

    if (username.length < 3 || username.length > 20) {
      throw new Error('用户名长度必须在3-20个字符之间')
    }

    console.log('发送用户名检查请求:', username)
    const response = await request({
      url: USER.CHECK_USERNAME,
      method: 'get',
      params: { username }
    })

    console.log('用户名检查原始响应:', response)
    
    // 处理不同的响应格式
    if (response) {
      // 如果响应有code字段，使用标准格式
      if (response.hasOwnProperty('code')) {
        return {
          code: response.code,
          message: response.message || '检查完成',
          data: response.data
        }
      }
      // 如果响应直接是布尔值
      else if (typeof response === 'boolean') {
        return {
          code: 200,
          message: '检查完成',
          data: response
        }
      }
      // 如果响应有data字段但没有code
      else if (response.hasOwnProperty('data')) {
        return {
          code: 200,
          message: '检查完成',
          data: response.data
        }
      }
      // 其他情况，假设响应本身就是结果
      else {
        return {
          code: 200,
          message: '检查完成',
          data: response
        }
      }
    }

    // 如果没有响应，返回错误
    return {
      code: 500,
      message: '检查用户名可用性失败',
      data: false
    }

  } catch (error) {
    console.error('检查用户名可用性失败:', error)
    
    // 如果是网络错误或其他axios错误
    if (error.response) {
      const { status, data } = error.response
      console.log('错误响应状态:', status, '数据:', data)
      
      return {
        code: status,
        message: data?.message || error.message || '检查用户名可用性失败',
        data: false
      }
    }
    
    // 如果是其他类型的错误
    return {
      code: 500,
      message: error.message || '检查用户名可用性失败',
      data: false
    }
  }
}

// 获取用户列表（管理员功能）
export async function getUserList(params = {}) {
  try {
    const response = await request({
      url: USER.LIST,
      method: 'get',
      params: {
        page: params.page || 0,
        size: params.size || 10,
        sort: params.sort || 'createTime',
        direction: params.direction || 'desc'
      }
    })
    return response
  } catch (error) {
    return handleError(error, '获取用户列表失败')
  }
}

// 搜索用户（管理员功能）
export async function searchUsers(params = {}) {
  try {
    const response = await request({
      url: USER.SEARCH,
      method: 'get',
      params: {
        keyword: params.keyword || '',
        page: params.page || 0,
        size: params.size || 10,
        sort: params.sort || 'createTime',
        direction: params.direction || 'desc'
      }
    })
    return response
  } catch (error) {
    return handleError(error, '搜索用户失败')
  }
}

// 删除用户（管理员功能）
export async function deleteUser(userId) {
  try {
    if (!userId) {
      throw new Error('用户ID不能为空')
    }

    const response = await request({
      url: USER.DELETE.replace('{userId}', userId),
      method: 'delete'
    })
    return response
  } catch (error) {
    return handleError(error, '删除用户失败')
  }
}

// VIP相关接口

// 更新用户VIP状态
export async function updateVipStatus(userId, vipData) {
  try {
    if (!userId) {
      throw new Error('用户ID不能为空')
    }

    const response = await request({
      url: USER.VIP_UPDATE.replace('{userId}', userId),
      method: 'put',
      data: vipData
    })
    return response
  } catch (error) {
    return handleError(error, '更新VIP状态失败')
  }
}

// 取消用户VIP状态
export async function cancelVipStatus(userId) {
  try {
    if (!userId) {
      throw new Error('用户ID不能为空')
    }

    const response = await request({
      url: USER.VIP_CANCEL.replace('{userId}', userId),
      method: 'delete'
    })
    return response
  } catch (error) {
    return handleError(error, '取消VIP状态失败')
  }
}

// 保留旧的API方法名以保持兼容性
export const updateUserInfo = updateProfile
export const updateUserSettings = updateProfile 