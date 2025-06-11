<template>
  <div class="update-profile-container">
    <el-card class="form-card" v-loading="loading">
      <template #header>
        <div class="card-header">
          <h3>更新个人信息</h3>
        </div>
      </template>
      
      <el-form 
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-width="100px"
        @submit.prevent="handleSubmit"
      >
        <el-form-item label="头像" class="avatar-item">
          <el-upload
            class="avatar-uploader"
            :show-file-list="false"
            :before-upload="beforeAvatarUpload"
            :http-request="handleAvatarUpload"
          >
            <img v-if="formData.avatar" :src="formData.avatar" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
          <div class="avatar-tip">点击上传头像</div>
        </el-form-item>

        <el-form-item label="邮箱" prop="email">
          <el-input
            v-model="formData.email"
            placeholder="请输入邮箱"
          />
        </el-form-item>

        <el-form-item label="手机号" prop="phone">
          <el-input
            v-model="formData.phone"
            placeholder="请输入手机号"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleSubmit" :loading="loading">
            保存修改
          </el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import { useStore } from 'vuex'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'

export default {
  name: 'UpdateProfile',
  components: {
    Plus
  },
  setup() {
    const store = useStore()
    const formRef = ref(null)
    const loading = ref(false)

    const formData = reactive({
      email: '',
      phone: '',
      avatar: ''
    })

    const rules = {
      email: [
        { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
      ],
      phone: [
        { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
      ]
    }

    // 初始化表单数据
    const initFormData = () => {
      const userInfo = store.getters['user/userInfo']
      if (userInfo) {
        formData.email = userInfo.email || ''
        formData.phone = userInfo.phone || ''
        formData.avatar = userInfo.avatar || ''
      }
    }

    // 头像上传前的验证
    const beforeAvatarUpload = (file) => {
      const isLt2M = file.size / 1024 / 1024 < 2
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif']

      if (!allowedTypes.includes(file.type)) {
        ElMessage.error('上传头像只能是 JPG/PNG/GIF 格式!')
        return false
      }
      if (!isLt2M) {
        ElMessage.error('上传头像图片大小不能超过 2MB!')
        return false
      }
      return true
    }

    // 处理头像上传
    const handleAvatarUpload = async (options) => {
      try {
        loading.value = true
        // 模拟文件上传，实际项目中应该调用后端API上传文件
        // 这里我们假设文件已经上传到服务器的/uploads/avatars/目录
        const fileName = options.file.name
        const avatarUrl = `/uploads/avatars/${fileName}`
        formData.avatar = avatarUrl
        
        ElMessage.success('头像上传成功')
      } catch (error) {
        console.error('头像上传错误:', error)
        ElMessage.error('头像上传失败')
      } finally {
        loading.value = false
      }
    }

    // 提交表单
    const handleSubmit = async () => {
      if (!formRef.value) return
      
      try {
        await formRef.value.validate()
        loading.value = true
        
        await store.dispatch('user/updateUserInfo', {
          email: formData.email,
          phone: formData.phone,
          avatar: formData.avatar
        })
        
        ElMessage.success('个人信息更新成功')
      } catch (error) {
        if (error.message) {
          ElMessage.error(error.message)
        }
      } finally {
        loading.value = false
      }
    }

    // 重置表单
    const resetForm = () => {
      if (formRef.value) {
        formRef.value.resetFields()
        initFormData()
      }
    }

    onMounted(() => {
      initFormData()
    })

    return {
      formRef,
      formData,
      rules,
      loading,
      handleSubmit,
      resetForm,
      beforeAvatarUpload,
      handleAvatarUpload
    }
  }
}
</script>

<style scoped>
.update-profile-container {
  max-width: 600px;
  margin: 20px auto;
  padding: 0 20px;
}

.form-card {
  border-radius: 8px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h3 {
  margin: 0;
  font-size: 18px;
  color: var(--el-text-color-primary);
}

.avatar-uploader {
  text-align: center;
}

.avatar-uploader .avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
}

.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 50%;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  text-align: center;
  border-radius: 50%;
  background-color: var(--el-bg-color-page);
  display: flex;
  justify-content: center;
  align-items: center;
}

.avatar-tip {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  margin-top: 8px;
}

.avatar-item :deep(.el-form-item__content) {
  justify-content: center;
}
</style>