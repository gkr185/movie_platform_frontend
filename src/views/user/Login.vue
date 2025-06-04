<template>
  <div class="login-container">
    <el-card class="login-card">
      <div class="login-header">
        <h2>用户登录</h2>
      </div>
      <el-form :model="loginForm" :rules="rules" ref="loginForm" label-width="0">
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
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleLogin" class="login-button">登录</el-button>
        </el-form-item>
        <div class="login-options">
          <el-checkbox v-model="rememberMe">记住我</el-checkbox>
          <router-link to="/register" class="register-link">注册账号</router-link>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      rememberMe: false,
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          // TODO: 实现登录逻辑
        }
      })
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
}

.login-card {
  width: 400px;
  padding: 20px;
}

.login-header {
  text-align: center;
  margin-bottom: 30px;

  h2 {
    margin: 0;
    color: #303133;
  }
}

.login-button {
  width: 100%;
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
</style> 