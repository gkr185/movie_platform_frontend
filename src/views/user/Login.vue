<template>
  <div class="login-container">
    <el-card class="login-card">
      <div class="login-header">
        <h2>用户登录</h2>
      </div>
      <el-form 
        :model="loginForm" 
        :rules="rules" 
        ref="loginFormRef" 
        label-width="0"
        @submit.prevent="handleLogin"
      >
        <el-form-item prop="username">
          <el-input 
            v-model="loginForm.username"
            prefix-icon="el-icon-user"
            placeholder="用户名"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input 
            v-model="loginForm.password"
            prefix-icon="el-icon-lock"
            type="password"
            placeholder="密码"
            @keyup.enter="handleLogin"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button 
            type="primary" 
            class="login-button" 
            :loading="loading"
            @click="handleLogin"
          >
            {{ loading ? '登录中...' : '登录' }}
          </el-button>
        </el-form-item>
        <div class="login-options">
          <el-checkbox v-model="rememberMe">记住我</el-checkbox>
          <router-link to="/register" class="register-link">注册账号</router-link>
        </div>
      </el-form>

      <!-- 第三方登录 -->
      <div class="other-login">
        <div class="divider">
          <span>其他登录方式</span>
        </div>
        <div class="login-methods">
          <el-button type="text" icon="el-icon-mobile-phone">手机登录</el-button>
          <el-button type="text" icon="el-icon-chat-dot-round">微信登录</el-button>
          <el-button type="text" icon="el-icon-message">邮箱登录</el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'

export default {
  name: 'Login',
  setup() {
    const store = useStore()
    const router = useRouter()
    const route = useRoute()
    const loginFormRef = ref(null)
    const loading = ref(false)
    const rememberMe = ref(false)

    const loginForm = reactive({
      username: '',
      password: ''
    })

    // 从本地存储加载记住的用户名
    onMounted(() => {
      const rememberedUsername = localStorage.getItem('rememberedUsername')
      if (rememberedUsername) {
        loginForm.username = rememberedUsername
        rememberMe.value = true
      }
    })

    // 表单验证规则
    const rules = {
      username: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { min: 3, message: '用户名长度不能小于3位', trigger: 'blur' }
      ],
      password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 6, message: '密码长度不能小于6位', trigger: 'blur' }
      ]
    }

    const handleLogin = async () => {
      if (!loginFormRef.value) return

      try {
        const valid = await loginFormRef.value.validate()
        if (valid) {
          loading.value = true
          
          // 处理记住用户名
          if (rememberMe.value) {
            localStorage.setItem('rememberedUsername', loginForm.username)
          } else {
            localStorage.removeItem('rememberedUsername')
          }

          await store.dispatch('user/login', loginForm)
          
          // 确保用户信息已加载
          await store.dispatch('user/getUserInfo')
          
          ElMessage.success('登录成功')
          
          // 检查是否有重定向地址
          const redirect = route.query.redirect
          if (redirect && !redirect.includes('/user/login')) {
            router.push(redirect)
          } else {
            router.push('/')
          }
        }
      } catch (error) {
        console.error('登录错误:', error)
        if (error.response) {
          const { status, data } = error.response
          if (status === 401) {
            ElMessage.error('用户名或密码错误')
          } else if (data && data.message) {
            ElMessage.error(data.message)
          } else {
            ElMessage.error('登录失败，请重试')
          }
        } else if (error.message) {
          ElMessage.error(error.message)
        } else {
          ElMessage.error('网络错误，请检查网络连接')
        }
      } finally {
        loading.value = false
      }
    }

    return {
      loginForm,
      loginFormRef,
      loading,
      rememberMe,
      rules,
      handleLogin
    }
  }
}
</script>

<style lang="scss" scoped>
.login-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--bg-color);
  background-image: linear-gradient(135deg, var(--bg-color) 0%, var(--card-bg-color) 100%);
}

.login-card {
  width: 400px;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
  background-color: var(--card-bg-color);
  border-color: var(--border-color);
}

.login-header {
  text-align: center;
  margin-bottom: 30px;

  h2 {
    color: var(--text-color);
    font-size: 24px;
    margin: 0;
  }
}

.login-button {
  width: 100%;
  margin-top: 10px;
}

.login-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 15px;
}

.register-link {
  color: var(--el-color-primary);
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
}

.other-login {
  margin-top: 30px;

  .divider {
    display: flex;
    align-items: center;
    margin: 20px 0;
    color: var(--text-color-light);

    &::before,
    &::after {
      content: '';
      flex: 1;
      height: 1px;
      background-color: var(--border-color);
    }

    span {
      padding: 0 15px;
      font-size: 14px;
    }
  }

  .login-methods {
    display: flex;
    justify-content: space-around;

    .el-button {
      font-size: 14px;

      .el-icon {
        margin-right: 5px;
      }
    }
  }
}
</style> 