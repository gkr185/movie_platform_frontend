<template>
  <div class="feedback-container">
    <el-card class="feedback-card">
      <template #header>
        <div class="card-header">
          <h3>用户反馈</h3>
        </div>
      </template>

      <el-tabs v-model="activeTab" class="feedback-tabs">
        <!-- 提交反馈 -->
        <el-tab-pane label="提交反馈" name="submit">
          <el-form 
            :model="feedbackForm" 
            :rules="rules" 
            ref="feedbackFormRef"
            label-width="100px"
            class="feedback-form"
          >
            <el-form-item label="反馈类型" prop="type">
              <el-select v-model="feedbackForm.type" placeholder="请选择反馈类型">
                <el-option 
                  v-for="option in feedbackTypes" 
                  :key="option.value" 
                  :label="option.label" 
                  :value="option.value"
                />
              </el-select>
            </el-form-item>

            <el-form-item label="联系方式" prop="contact">
              <el-input 
                v-model="feedbackForm.contact" 
                placeholder="请输入邮箱或手机号"
                type="email"
              />
            </el-form-item>

            <el-form-item label="反馈内容" prop="content">
              <el-input 
                v-model="feedbackForm.content" 
                type="textarea"
                :rows="6"
                placeholder="请详细描述您的问题或建议..."
                maxlength="500"
                show-word-limit
              />
            </el-form-item>

            <el-form-item>
              <el-button 
                type="primary" 
                @click="submitFeedback"
                :loading="submitting"
              >
                提交反馈
              </el-button>
              <el-button @click="resetForm">重置</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <!-- 历史反馈 -->
        <el-tab-pane label="历史反馈" name="history">
          <div class="feedback-history">
            <div class="history-header">
              <h4>我的反馈记录</h4>
              <el-button 
                type="primary" 
                plain 
                @click="loadFeedbackHistory"
                :loading="loadingHistory"
              >
                刷新
              </el-button>
            </div>

            <div v-loading="loadingHistory" class="feedback-list">
              <el-empty v-if="!feedbackList.length && !loadingHistory" description="暂无反馈记录" />
              
              <div 
                v-for="feedback in feedbackList" 
                :key="feedback.id"
                class="feedback-item"
              >
                <el-card class="feedback-card-item">
                  <div class="feedback-header">
                    <div class="feedback-info">
                      <el-tag 
                        :type="getTypeTagType(feedback.type)"
                        size="small"
                      >
                        {{ getTypeLabel(feedback.type) }}
                      </el-tag>
                      <el-tag 
                        :type="getStatusTagType(feedback.status)"
                        size="small"
                        class="status-tag"
                      >
                        {{ getStatusLabel(feedback.status) }}
                      </el-tag>
                    </div>
                    <div class="feedback-time">
                      {{ formatDate(feedback.createTime) }}
                    </div>
                  </div>

                  <div class="feedback-content">
                    <p><strong>反馈内容：</strong></p>
                    <p class="content-text">{{ feedback.content }}</p>
                  </div>

                  <div class="feedback-contact">
                    <p><strong>联系方式：</strong>{{ feedback.contact }}</p>
                  </div>

                  <div v-if="feedback.reply" class="feedback-reply">
                    <el-divider />
                    <p><strong>官方回复：</strong></p>
                    <p class="reply-text">{{ feedback.reply }}</p>
                    <p class="reply-time">回复时间：{{ formatDate(feedback.replyTime) }}</p>
                  </div>
                </el-card>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import { ref, reactive, onMounted, computed } from 'vue'
import { useStore } from 'vuex'
import { ElMessage } from 'element-plus'
import { 
  createFeedback, 
  getUserFeedbackHistory,
  FEEDBACK_TYPES,
  FEEDBACK_STATUS,
  getTypeTagType,
  getStatusTagType
} from '@/api/feedback'

export default {
  name: 'UserFeedback',
  setup() {
    const store = useStore()
    const activeTab = ref('submit')
    const feedbackFormRef = ref()
    const submitting = ref(false)
    const loadingHistory = ref(false)
    const feedbackList = ref([])

    // 获取当前用户信息
    const userInfo = computed(() => store.getters['user/userInfo'])

    // 反馈类型选项
    const feedbackTypes = Object.entries(FEEDBACK_TYPES).map(([value, label]) => ({
      value: parseInt(value),
      label
    }))

    // 反馈表单
    const feedbackForm = reactive({
      type: '',
      contact: '',
      content: ''
    })

    // 表单验证规则
    const rules = {
      type: [
        { required: true, message: '请选择反馈类型', trigger: 'change' }
      ],
      contact: [
        { required: true, message: '请输入联系方式', trigger: 'blur' },
        { 
          validator: (rule, value, callback) => {
            if (!value) {
              callback(new Error('请输入联系方式'))
            } else if (!/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(value) && !/^1[3-9]\d{9}$/.test(value)) {
              callback(new Error('请输入正确的邮箱或手机号'))
            } else {
              callback()
            }
          }, 
          trigger: 'blur' 
        }
      ],
      content: [
        { required: true, message: '请输入反馈内容', trigger: 'blur' },
        { min: 10, message: '反馈内容至少10个字符', trigger: 'blur' }
      ]
    }

    // 提交反馈
    const submitFeedback = async () => {
      if (!userInfo.value) {
        ElMessage.error('请先登录')
        return
      }

      try {
        // 表单验证
        const valid = await feedbackFormRef.value.validate().catch(() => false)
        if (!valid) {
          ElMessage.error('请检查表单填写是否正确')
          return
        }

        submitting.value = true

        const feedbackData = {
          userId: userInfo.value.id,
          content: feedbackForm.content,
          type: feedbackForm.type,
          contact: feedbackForm.contact,
          status: 0 // 待处理状态
        }

        const response = await createFeedback(feedbackData)

        if (response.status === 200 && response.data) {
          ElMessage.success('反馈提交成功！感谢您的反馈')
          resetForm()
          // 切换到历史反馈并刷新列表
          activeTab.value = 'history'
          loadFeedbackHistory()
        } else {
          throw new Error('提交失败')
        }
      } catch (error) {
        console.error('提交反馈失败:', error)
        if (error.response && error.response.data) {
          ElMessage.error(error.response.data.message || '提交反馈失败，请重试')
        } else {
          ElMessage.error(error.message || '提交反馈失败，请重试')
        }
      } finally {
        submitting.value = false
      }
    }

    // 重置表单
    const resetForm = () => {
      feedbackFormRef.value?.resetFields()
      Object.assign(feedbackForm, {
        type: '',
        contact: '',
        content: ''
      })
    }

    // 加载反馈历史
    const loadFeedbackHistory = async () => {
      if (!userInfo.value) {
        ElMessage.error('请先登录')
        return
      }

      try {
        loadingHistory.value = true
        const response = await getUserFeedbackHistory(userInfo.value.id)
        
        if (response.status === 200) {
          feedbackList.value = response.data || []
        } else {
          throw new Error('获取反馈历史失败')
        }
      } catch (error) {
        console.error('获取反馈历史失败:', error)
        ElMessage.error('获取反馈历史失败')
      } finally {
        loadingHistory.value = false
      }
    }

    // 获取反馈类型标签
    const getTypeLabel = (type) => {
      return FEEDBACK_TYPES[type] || '未知类型'
    }

    // 获取状态标签
    const getStatusLabel = (status) => {
      return FEEDBACK_STATUS[status] || '未知状态'
    }

    // 格式化日期
    const formatDate = (dateString) => {
      if (!dateString) return ''
      const date = new Date(dateString)
      return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    // 初始化页面
    onMounted(() => {
      // 如果用户已登录，预填充联系方式
      if (userInfo.value?.email) {
        feedbackForm.contact = userInfo.value.email
      }
    })

    return {
      activeTab,
      feedbackFormRef,
      submitting,
      loadingHistory,
      feedbackList,
      feedbackTypes,
      feedbackForm,
      rules,
      submitFeedback,
      resetForm,
      loadFeedbackHistory,
      getTypeLabel,
      getTypeTagType,
      getStatusLabel,
      getStatusTagType,
      formatDate
    }
  }
}
</script>

<style scoped>
.feedback-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
}

.feedback-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: between;
  align-items: center;
}

.card-header h3 {
  margin: 0;
  color: #333;
}

.feedback-tabs {
  margin-top: 20px;
}

.feedback-form {
  max-width: 600px;
}

.feedback-form .el-form-item {
  margin-bottom: 24px;
}

.feedback-form .el-textarea {
  width: 100%;
}

.feedback-history {
  width: 100%;
}

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.history-header h4 {
  margin: 0;
  color: #333;
}

.feedback-list {
  min-height: 200px;
}

.feedback-item {
  margin-bottom: 16px;
}

.feedback-card-item {
  background: #f9f9f9;
  border: 1px solid #e0e0e0;
}

.feedback-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.feedback-info {
  display: flex;
  gap: 8px;
}

.status-tag {
  margin-left: 8px;
}

.feedback-time {
  color: #666;
  font-size: 12px;
}

.feedback-content {
  margin-bottom: 12px;
}

.content-text {
  margin: 8px 0;
  line-height: 1.6;
  color: #333;
  background: #fff;
  padding: 12px;
  border-radius: 4px;
  border: 1px solid #e0e0e0;
}

.feedback-contact {
  margin-bottom: 12px;
  color: #666;
  font-size: 14px;
}

.feedback-reply {
  background: #f0f9ff;
  padding: 12px;
  border-radius: 4px;
  border-left: 4px solid #409eff;
}

.reply-text {
  margin: 8px 0;
  line-height: 1.6;
  color: #333;
}

.reply-time {
  color: #666;
  font-size: 12px;
  margin-top: 8px;
}

/* 深色主题适配 */
[data-theme="dark"] .feedback-container {
  background: #1a1a1a;
}

[data-theme="dark"] .card-header h3,
[data-theme="dark"] .history-header h4 {
  color: #e6e6e6;
}

[data-theme="dark"] .feedback-card-item {
  background: #2a2a2a;
  border-color: #404040;
}

[data-theme="dark"] .content-text {
  background: #1e1e1e;
  color: #e6e6e6;
  border-color: #404040;
}

[data-theme="dark"] .feedback-reply {
  background: #1e3a5f;
}

[data-theme="dark"] .reply-text {
  color: #e6e6e6;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .feedback-container {
    padding: 10px;
  }
  
  .feedback-form {
    max-width: 100%;
  }
  
  .feedback-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .feedback-info {
    flex-wrap: wrap;
  }
}
</style> 