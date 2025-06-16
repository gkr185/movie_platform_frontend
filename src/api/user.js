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

    return await request({
      url: USER.REGISTER,
      method: 'post',
      data
    })
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

    return await request({
      url: USER.LOGIN,
      method: 'post',
      data
    })
  } catch (error) {
    return handleError(error, '登录失败')
  }
}

// 获取用户信息
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

// 更新用户信息
export async function updateUserInfo(userId, data) {
  try {
    if (!userId) {
      throw new Error('用户ID不能为空')
    }

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

    return await request({
      url: USER.PROFILE.replace('{userId}', userId),
      method: 'put',
      data
    })
  } catch (error) {
    return handleError(error, '更新用户信息失败')
  }
}

// 更新用户设置
export async function updateUserSettings(userId, data) {
  try {
    if (!userId) {
      throw new Error('用户ID不能为空')
    }

    if (!data || Object.keys(data).length === 0) {
      throw new Error('设置内容不能为空')
    }

    return await request({
      url: `${USER.PROFILE.replace('{userId}', userId)}/settings`,
      method: 'put',
      data
    })
  } catch (error) {
    return handleError(error, '更新用户设置失败')
  }
}

// 修改密码
export async function changePassword(userId, data) {
  try {
    if (!userId) {
      throw new Error('用户ID不能为空')
    }

    if (!data.oldPassword || !data.newPassword) {
      throw new Error('原密码和新密码不能为空')
    }

    if (data.newPassword.length < 6 || data.newPassword.length > 20) {
      throw new Error('新密码长度必须在6-20个字符之间')
    }

    const requestData = {
      oldPassword: data.oldPassword,
      newPassword: data.newPassword
    }

    return await request({
      url: USER.CHANGE_PASSWORD.replace('{userId}', userId),
      method: 'put',
      params: {
        oldPassword: data.oldPassword,
        newPassword: data.newPassword
      }
    })
  } catch (error) {
    return handleError(error, '修改密码失败')
  }
}

// 注销账户
export function deleteAccount(userId) {
  return request({
    url: USER.PROFILE.replace('{userId}', userId),
    method: 'delete'
  })
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
 