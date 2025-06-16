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
          <div class="avatar-upload-section">
            <FileUpload
              ref="avatarUploadRef"
              category="avatar"
              :related-id="userId"
              url-type="avatar"
              :auto-update-db="!!userId"
              upload-text="上传头像"
              :max-size="5"
              :file-types="['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp']"
              @upload-success="handleAvatarUploadSuccess"
            >
              <template #trigger>
                <div class="avatar-uploader">
                  <img v-if="formData.avatar" :src="formData.avatar" class="avatar" />
                  <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
                </div>
              </template>
            </FileUpload>
            
            <div class="manual-input" style="margin-top: 10px;">
              <el-input
                v-model="formData.avatar"
                placeholder="或直接输入头像URL"
                size="small"
              >
                <template #prepend>头像URL</template>
              </el-input>
            </div>
            
            <div class="avatar-tip">
              <p>点击上传头像，支持JPG、PNG、GIF等格式</p>
              <p>文件大小不超过5MB，建议使用正方形图片</p>
            </div>
          </div>
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
import { ref, reactive, onMounted, computed } from 'vue'
import { useStore } from 'vuex'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import FileUpload from '@/components/FileUpload.vue'

export default {
  name: 'UpdateProfile',
  components: {
    Plus,
    FileUpload
  },
  setup() {
    const store = useStore()
    const formRef = ref(null)
    const avatarUploadRef = ref(null)
    const loading = ref(false)

    const formData = reactive({
      email: '',
      phone: '',
      avatar: ''
    })

    // 获取当前用户ID
    const userId = computed(() => {
      const userInfo = store.getters['user/userInfo']
      return userInfo?.id || userInfo?.userId
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

    // 头像上传成功处理
    const handleAvatarUploadSuccess = (response) => {
      if (response.success) {
        formData.avatar = response.fileUrl
        ElMessage.success('头像上传成功')
        
        // 如果启用了自动更新数据库，则不需要手动保存
        if (userId.value) {
          ElMessage.info('头像已自动更新到您的账户')
        }
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
      avatarUploadRef,
      formData,
      rules,
      loading,
      userId,
      handleSubmit,
      resetForm,
      handleAvatarUploadSuccess
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

.avatar-upload-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.avatar-uploader {
  text-align: center;
  border: 1px dashed var(--el-border-color);
  border-radius: 50%;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
  width: 100px;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.avatar-uploader:hover {
  border-color: var(--el-color-primary);
}

.avatar-uploader .avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
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

.manual-input {
  width: 100%;
  max-width: 400px;
}

.avatar-tip {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  text-align: center;
  line-height: 1.4;
}

.avatar-tip p {
  margin: 4px 0;
}

.avatar-item :deep(.el-form-item__content) {
  justify-content: center;
}
</style>