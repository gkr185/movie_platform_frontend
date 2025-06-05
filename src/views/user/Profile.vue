<template>
  <div class="user-profile">
    <h2>个人资料</h2>
    <el-form :model="userForm" label-width="100px" class="profile-form">
      <el-form-item label="头像">
        <el-upload
          class="avatar-uploader"
          action="#"
          :show-file-list="false"
        >
          <img v-if="userForm.avatar" :src="userForm.avatar" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="用户名">
        <el-input v-model="userForm.username"></el-input>
      </el-form-item>
      <el-form-item label="邮箱">
        <el-input v-model="userForm.email"></el-input>
      </el-form-item>
      <el-form-item label="手机号">
        <el-input v-model="userForm.phone"></el-input>
      </el-form-item>
      <el-form-item label="个人简介">
        <el-input type="textarea" v-model="userForm.bio" :rows="4"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary">保存修改</el-button>
      </el-form-item>
    </el-form>

    <el-divider></el-divider>

    <h3>修改密码</h3>
    <el-form :model="passwordForm" label-width="100px" class="password-form">
      <el-form-item label="原密码">
        <el-input type="password" v-model="passwordForm.oldPassword"></el-input>
      </el-form-item>
      <el-form-item label="新密码">
        <el-input type="password" v-model="passwordForm.newPassword"></el-input>
      </el-form-item>
      <el-form-item label="确认密码">
        <el-input type="password" v-model="passwordForm.confirmPassword"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary">修改密码</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'UserProfile',
  data() {
    return {
      userForm: {
        avatar: '',
        username: '',
        email: '',
        phone: '',
        bio: ''
      },
      passwordForm: {
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.user-profile {
  h2, h3 {
    margin-bottom: 20px;
  }

  .profile-form, .password-form {
    max-width: 600px;
  }

  .avatar-uploader {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    width: 100px;
    height: 100px;

    &:hover {
      border-color: #409EFF;
    }
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 100px;
    height: 100px;
    line-height: 100px;
    text-align: center;
  }

  .avatar {
    width: 100px;
    height: 100px;
    display: block;
  }

  .el-divider {
    margin: 30px 0;
  }
}
</style> 