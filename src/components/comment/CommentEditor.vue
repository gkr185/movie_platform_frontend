<template>
  <div class="comment-editor">
    <div class="editor-header">
      <h3>{{ replyTo ? '回复评论' : '发表评论' }}</h3>
      <div v-if="!replyTo" class="rating">
        <span class="label">评分：</span>
        <el-rate
          v-model="score"
          :max="10"
          :low-threshold="4"
          :high-threshold="8"
          :colors="['#F56C6C', '#E6A23C', '#67C23A']"
        />
        <span class="score-value">{{ score }}分</span>
      </div>
    </div>

    <div class="editor-content">
      <el-input
        v-model="content"
        type="textarea"
        :rows="3"
        :maxlength="1000"
        placeholder="写下你的观后感..."
        show-word-limit
        resize="none"
      />
    </div>

    <div class="editor-footer">
      <div class="left-actions">
        <div class="score-wrapper">
          <span class="label">评分：</span>
          <el-rate
            v-model="score"
            :max="10"
            :low-threshold="4"
            :high-threshold="8"
            :colors="['#F56C6C', '#E6A23C', '#67C23A']"
          />
          <span class="score-value">{{ score }}分</span>
        </div>
        
        <el-checkbox v-model="isPrivate">
          <el-tooltip
            content="开启后仅自己可见"
            placement="top"
          >
            <span>私密评论</span>
          </el-tooltip>
        </el-checkbox>
      </div>
      
      <div class="right-actions">
        <el-button @click="handleCancel">取消</el-button>
        <el-button 
          type="primary" 
          :loading="submitting"
          :disabled="!canSubmit"
          @click="handleSubmit"
        >发表评论</el-button>
      </div>
    </div>
  </div>
</template>


<script>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { ElMessage } from 'element-plus'

export default {
  name: 'CommentEditor',
  props: {
    movieId: {
      type: [String, Number],
      required: true
    },
    replyTo: {
      type: Object,
      default: null
    },
    parentId: {
      type: [String, Number],
      default: null
    }
  },
  emits: ['cancel', 'success'],
  setup(props, { emit }) {
    const store = useStore()
    const content = ref('')
    const score = ref(8)
    const isPrivate = ref(false)
    const submitting = ref(false)

    const canSubmit = computed(() => {
      if (props.replyTo) {
        return content.value.trim().length > 0
      }
      return content.value.trim().length > 0 && score.value > 0
    })

    const handleCancel = () => {
      content.value = ''
      score.value = 8
      isPrivate.value = false
      emit('cancel')
    }

    const handleSubmit = async () => {
      if (!canSubmit.value) return

      submitting.value = true
      try {
        if (props.replyTo) {
          // 发表回复
          await store.dispatch('comment/addReply', {
            parentId: props.parentId,
            content: content.value.trim(),
            replyTo: props.replyTo
          })
          ElMessage.success('回复成功')
        } else {
          // 发表评论
          await store.dispatch('comment/addComment', {
            movieId: props.movieId,
            content: content.value.trim(),
            score: score.value,
            isPrivate: isPrivate.value
          })
          ElMessage.success('评论成功')
        }
        emit('success')
      } catch (error) {
        ElMessage.error(error.message || '发表失败，请重试')
      } finally {
        submitting.value = false
      }
    }

    return {
      content,
      score,
      isPrivate,
      submitting,
      canSubmit,
      handleCancel,
      handleSubmit
    }
  }
}
</script>

<style lang="scss" scoped>
.comment-editor {
  padding: 20px;
  margin-bottom: 30px;
  background-color: var(--comment-editor-bg);
  border: 1px solid var(--comment-editor-border);
  border-radius: 8px;

  .editor-header {
    display: flex;
    align-items: center;
    margin-bottom: 20px;

    .avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      margin-right: 12px;
    }

    .rating {
      margin-left: auto;
    }
  }

  .editor-content {
    .el-input__wrapper {
      background-color: var(--input-bg-color);
    }

    .el-textarea__inner {
      color: var(--text-color);
      
      &::placeholder {
        color: var(--text-color-light);
      }
    }
  }

  .editor-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 15px;

    .left-actions {
      display: flex;
      align-items: center;
      gap: 20px;

      .score-wrapper {
        display: flex;
        align-items: center;
        gap: 10px;

        .label {
          color: var(--text-color-light);
        }

        .score-value {
          color: var(--text-color);
          min-width: 40px;
        }
      }
    }

    .right-actions {
      display: flex;
      gap: 10px;
    }
  }

  .reply-info {
    margin: -10px 0 15px;
    padding: 8px 12px;
    background-color: var(--comment-reply-bg);
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .reply-text {
      color: var(--text-color-light);
      font-size: 14px;

      .username {
        color: var(--text-color);
        font-weight: 500;
      }
    }

    .cancel-reply {
      color: var(--comment-action);
      cursor: pointer;

      &:hover {
        color: var(--comment-action-hover);
      }
    }
  }
}
</style> 