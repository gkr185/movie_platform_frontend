<template>
  <div class="login-container">
    <el-card class="login-card">
      <div class="login-header">
        <h2>用户登录</h2>
      </div>
      <el-form 
        :model="loginForm" 
        :rules="rules" 
        ref="loginForm" 
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

    <!-- 快捷导航菜单 -->
    <el-dialog
      title="欢迎回来"
      v-model="showQuickNav"
      width="400px"
      center
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <div class="quick-nav">
        <el-row :gutter="20">
          <el-col :span="8">
            <div class="nav-item" @click="navigateTo('/user/profile')">
              <i class="el-icon-user"></i>
              <span>个人资料</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="nav-item" @click="navigateTo('/user/vip')">
              <i class="el-icon-trophy"></i>
              <span>会员中心</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="nav-item" @click="navigateTo('/user/favorites')">
              <i class="el-icon-star-off"></i>
              <span>我的收藏</span>
            </div>
          </el-col>
        </el-row>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="goToHome">进入首页</el-button>
          <el-button type="primary" @click="goToUserCenter">进入用户中心</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'Login',
  data() {
    // 自定义用户名验证规则
    const validateUsername = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入用户名'))
      } else if (value.length < 3) {
        callback(new Error('用户名长度不能小于3位'))
      } else {
        callback()
      }
    }
    // 自定义密码验证规则
    const validatePassword = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入密码'))
      } else if (value.length < 6) {
        callback(new Error('密码长度不能小于6位'))
      } else {
        callback()
      }
    }

    return {
      loginForm: {
        username: '',
        password: ''
      },
      rememberMe: false,
      loading: false,
      showQuickNav: false,
      rules: {
        username: [
          { required: true, trigger: 'blur', validator: validateUsername }
        ],
        password: [
          { required: true, trigger: 'blur', validator: validatePassword }
        ]
      }
    }
  },
  methods: {
    ...mapActions(['login']),
    async handleLogin() {
      try {
        const valid = await this.$refs.loginForm.validate()
        if (valid) {
          this.loading = true
          await this.login(this.loginForm)
          this.$message.success('登录成功')
          this.showQuickNav = true
        }
      } catch (error) {
        this.$message.error(error.message || '登录失败，请重试')
      } finally {
        this.loading = false
      }
    },
    navigateTo(path) {
      this.showQuickNav = false
      this.$router.push(path)
    },
    goToHome() {
      this.showQuickNav = false
      this.$router.push('/')
    },
    goToUserCenter() {
      this.showQuickNav = false
      this.$router.push('/user')
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
  background-color: #f5f7fa;
  background-image: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.login-card {
  width: 400px;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
}

.login-header {
  text-align: center;
  margin-bottom: 30px;

  h2 {
    margin: 0;
    color: #303133;
    font-size: 24px;
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
  color: #409EFF;
  text-decoration: none;

  &:hover {
    color: #66b1ff;
  }
}

.other-login {
  margin-top: 30px;

  .divider {
    display: flex;
    align-items: center;
    margin: 20px 0;
    color: #999;
    font-size: 14px;

    &::before,
    &::after {
      content: '';
      flex: 1;
      height: 1px;
      background: #dcdfe6;
    }

    span {
      padding: 0 15px;
    }
  }

  .login-methods {
    display: flex;
    justify-content: space-around;
    padding: 10px 0;

    .el-button {
      font-size: 14px;

      [class^="el-icon-"] {
        font-size: 18px;
        vertical-align: middle;
        margin-right: 4px;
      }
    }
  }
}

.quick-nav {
  padding: 20px 0;

  .nav-item {
    text-align: center;
    cursor: pointer;
    padding: 15px;
    border-radius: 8px;
    transition: all 0.3s;

    &:hover {
      background-color: #f5f7fa;
      color: #409EFF;
    }

    i {
      font-size: 24px;
      margin-bottom: 8px;
      display: block;
    }

    span {
      font-size: 14px;
    }
  }
}
</style> 