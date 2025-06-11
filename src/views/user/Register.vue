<template>
  <div class="register-container">
    <el-card class="register-card">
      <div class="register-header">
        <h2>用户注册</h2>
      </div>
      <el-form 
        :model="registerForm" 
        :rules="rules" 
        ref="registerFormRef" 
        label-width="0"
        @submit.prevent="handleRegister"
      >
        <el-form-item prop="username">
          <el-input 
            v-model="registerForm.username"
            prefix-icon="el-icon-user"
            placeholder="用户名"
          ></el-input>
        </el-form-item>
        <el-form-item prop="email">
          <el-input 
            v-model="registerForm.email"
            prefix-icon="el-icon-message"
            placeholder="邮箱"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input 
            v-model="registerForm.password"
            prefix-icon="el-icon-lock"
            type="password"
            placeholder="密码"
          ></el-input>
        </el-form-item>
        <el-form-item prop="confirmPassword">
          <el-input 
            v-model="registerForm.confirmPassword"
            prefix-icon="el-icon-lock"
            type="password"
            placeholder="确认密码"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button 
            type="primary" 
            class="register-button" 
            :loading="loading"
            @click="handleRegister"
          >
            {{ loading ? '注册中...' : '注册' }}
          </el-button>
        </el-form-item>
        <div class="login-link">
          已有账号？<router-link to="/user/login">立即登录</router-link>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { checkUsername } from '@/api/user'

export default {
  name: 'Register',
  setup() {
    const store = useStore()
    const router = useRouter()
    const registerFormRef = ref(null)
    const loading = ref(false)

    const registerForm = reactive({
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    })

    // 检查用户名是否可用
    const checkUsernameAvailable = async (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入用户名'))
        return
      }
      if (value.length < 3) {
        callback(new Error('用户名长度不能小于3位'))
        return
      }
      try {
        const response = await checkUsername(value)
        console.log('检查用户名响应:', response) // 调试日志
        
        if (response.code === 200) {
          // 后端返回 data: true 表示用户名可用
          if (response.data === true) {
            callback()
          } else {
            callback(new Error('该用户名已被使用'))
          }
        } else {
          callback(new Error(response.message || '检查用户名可用性失败，请重试'))
        }
      } catch (error) {
        console.error('检查用户名可用性失败:', error)
        callback(new Error(error.message || '检查用户名可用性失败，请重试'))
      }
    }

    // 表单验证规则
    const rules = reactive({
      username: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { min: 3, message: '用户名长度不能小于3位', trigger: 'blur' },
        { validator: checkUsernameAvailable, trigger: 'blur' }
      ],
      email: [
        { required: true, message: '请输入邮箱', trigger: 'blur' },
        { type: 'email', message: '请输入有效的邮箱地址', trigger: 'blur' }
      ],
      password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 6, message: '密码长度不能小于6位', trigger: 'blur' }
      ],
      confirmPassword: [
        { required: true, message: '请确认密码', trigger: 'blur' },
        { 
          validator: (rule, value, callback) => {
            if (value !== registerForm.password) {
              callback(new Error('两次输入的密码不一致'))
            } else {
              callback()
            }
          }, 
          trigger: 'blur' 
        }
      ]
    })

    const handleRegister = async () => {
      if (!registerFormRef.value) return

      try {
        loading.value = true
        const valid = await registerFormRef.value.validate()
        
        if (valid) {
          const registerData = {
            username: registerForm.username,
            email: registerForm.email,
            password: registerForm.password
          }

          const response = await store.dispatch('user/register', registerData)
          
          if (response && response.data) {
            ElMessage.success('注册成功，请登录')
            router.push({
              path: '/user/login',
              query: { username: registerForm.username }
            })
          } else {
            throw new Error('注册失败，请重试')
          }
        }
      } catch (error) {
        console.error('注册错误:', error)
        
        // 处理不同类型的错误
        if (error.response) {
          const { status, data } = error.response
          
          switch (status) {
            case 409:
              if (data.code === 'USERNAME_EXISTS') {
                ElMessage.error('用户名已被使用')
              } else if (data.code === 'EMAIL_EXISTS') {
                ElMessage.error('邮箱已被使用')
              } else {
                ElMessage.error(data.message || '注册失败，请重试')
              }
              break
            case 400:
              ElMessage.error(data.message || '请检查输入的信息是否正确')
              break
            case 500:
              ElMessage.error('服务器错误，请稍后重试')
              break
            default:
              ElMessage.error(data.message || '注册失败，请重试')
          }
        } else if (error.message) {
          ElMessage.error(error.message)
        } else {
          ElMessage.error('注册失败，请检查网络连接')
        }
      } finally {
        loading.value = false
      }
    }

    return {
      registerForm,
      registerFormRef,
      loading,
      rules,
      handleRegister
    }
  }
}
</script>

<style lang="scss" scoped>
.register-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--bg-color);
  background-image: linear-gradient(135deg, var(--bg-color) 0%, var(--card-bg-color) 100%);
}

.register-card {
  width: 400px;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
  background-color: var(--card-bg-color);
  border-color: var(--border-color);
}

.register-header {
  text-align: center;
  margin-bottom: 30px;

  h2 {
    color: var(--text-color);
    font-size: 24px;
    margin: 0;
  }
}

.register-button {
  width: 100%;
  margin-top: 10px;
}

.login-link {
  text-align: center;
  margin-top: 15px;
  color: var(--text-color-light);

  a {
    color: var(--el-color-primary);
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
}
</style> 