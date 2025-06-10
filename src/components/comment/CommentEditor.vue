<template>
  <div class="comment-editor">
    <!-- 评分区域 -->
    <div class="rating-section" v-if="!replyTo">
      <span class="rating-label">评分：</span>
      <el-rate
        v-model="score"
        :max="10"
        :allow-half="true"
        class="rating-stars"
      />
      <span class="rating-value">{{ score }}分</span>
    </div>

    <!-- 回复提示 -->
    <div v-if="replyTo" class="reply-info">
      回复 <span class="reply-name">@{{ replyTo.name }}</span>：
      <el-button 
        type="primary" 
        link
        class="cancel-reply"
        @click="handleCancelReply"
      >
        取消回复
      </el-button>
    </div>

    <!-- 编辑区域 -->
    <div class="editor-main">
      <el-input
        v-model="content"
        type="textarea"
        :rows="3"
        :maxlength="1000"
        :show-word-limit="true"
        resize="none"
        placeholder="写下你的评论..."
      />
      
      <div class="editor-footer">
        <div class="editor-options">
          <el-checkbox 
            v-if="!replyTo"
            v-model="isPrivate"
            class="private-check"
          >
            仅作者可见
          </el-checkbox>
        </div>
        
        <div class="editor-actions">
          <el-button @click="handleCancel">取消</el-button>
          <el-button 
            type="primary" 
            :loading="submitting"
            :disabled="!canSubmit"
            @click="handleSubmit"
          >
            发表评论
          </el-button>
        </div>
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
      type: [Number, String],
      required: true
    },
    replyTo: {
      type: Object,
      default: null
    }
  },
  emits: ['success', 'cancel'],
  setup(props, { emit }) {
    const store = useStore()
    const content = ref('')
    const score = ref(0)
    const isPrivate = ref(false)
    const submitting = ref(false)

    // 是否可以提交
    const canSubmit = computed(() => {
      if (!content.value.trim()) return false
      if (!props.replyTo && score.value === 0) return false
      return true
    })

    // 提交评论
    const handleSubmit = async () => {
      if (!canSubmit.value) return

      try {
        submitting.value = true
        if (props.replyTo) {
          // 提交回复
          await store.dispatch('comment/addReply', {
            parentId: props.replyTo.id,
            content: content.value.trim(),
            replyTo: props.replyTo
          })
        } else {
          // 提交评论
          await store.dispatch('comment/addComment', {
            movieId: props.movieId,
            content: content.value.trim(),
            score: score.value,
            isPrivate: isPrivate.value
          })
        }
        
        ElMessage.success('发表成功')
        resetForm()
        emit('success')
      } catch (error) {
        ElMessage.error(error.message || '发表失败')
      } finally {
        submitting.value = false
      }
    }

    // 取消
    const handleCancel = () => {
      resetForm()
      emit('cancel')
    }

    // 取消回复
    const handleCancelReply = () => {
      resetForm()
      emit('cancel')
    }

    // 重置表单
    const resetForm = () => {
      content.value = ''
      score.value = 0
      isPrivate.value = false
    }

    return {
      content,
      score,
      isPrivate,
      submitting,
      canSubmit,
      handleSubmit,
      handleCancel,
      handleCancelReply
    }
  }
}
</script>

<style lang="scss" scoped>
.comment-editor {
  padding: 20px;
  border-radius: 8px;
  background: var(--comment-editor-bg);
  box-shadow: var(--card-shadow);
  border: 1px solid var(--comment-editor-border);

  .rating-section {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;

    .rating-label {
      color: var(--comment-text);
      font-size: 14px;
    }

    .rating-stars {
      flex: 1;
    }

    .rating-value {
      min-width: 48px;
      color: var(--el-color-warning);
      font-size: 14px;
    }
  }

  .reply-info {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 16px;
    padding: 8px 12px;
    background: var(--comment-reply-bg);
    border-radius: 4px;
    color: var(--comment-text);
    font-size: 14px;

    .reply-name {
      color: var(--el-color-primary);
      font-weight: 500;
    }

    .cancel-reply {
      margin-left: auto;
      font-size: 13px;
      color: var(--comment-action);
      
      &:hover {
        color: var(--comment-action-hover);
      }
    }
  }

  .editor-main {
    .el-textarea {
      :deep(.el-textarea__inner) {
        background: var(--comment-bg);
        border-color: var(--comment-editor-border);
        color: var(--comment-text);
        transition: all 0.3s;

        &:hover, &:focus {
          background: var(--comment-bg);
          border-color: var(--el-color-primary);
        }

        &::placeholder {
          color: var(--comment-text-light);
        }
      }
    }
  }

  .editor-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 16px;
    padding-top: 16px;
    border-top: 1px solid var(--comment-divider);

    .editor-options {
      .private-check {
        color: var(--comment-text);
        font-size: 13px;
      }
    }

    .editor-actions {
      display: flex;
      gap: 12px;

      .el-button {
        &:not(.el-button--primary) {
          background: var(--comment-bg);
          border-color: var(--comment-border);
          color: var(--comment-text);

          &:hover {
            border-color: var(--el-color-primary);
            color: var(--el-color-primary);
          }
        }
      }
    }
  }
}

// 响应式设计
@media screen and (max-width: 768px) {
  .comment-editor {
    padding: 16px;

    .rating-section {
      flex-wrap: wrap;
      gap: 8px;

      .rating-label {
        width: 100%;
      }
    }

    .editor-footer {
      flex-direction: column;
      gap: 16px;

      .editor-actions {
        width: 100%;
        justify-content: flex-end;
      }
    }
  }
}

// 深色模式适配
html[data-theme='dark'] {
  .comment-editor {
    background: var(--el-bg-color);
    box-shadow: var(--el-box-shadow-dark);

    .reply-info {
      background: var(--el-color-primary-light-3);
      color: var(--el-text-color-primary);
    }

    .editor-main {
      .el-textarea {
        :deep(.el-textarea__inner) {
          background: var(--el-bg-color-overlay);
          border-color: var(--el-border-color);

          &:hover, &:focus {
            background: var(--el-bg-color-overlay);
          }
        }
      }
    }
  }
}
</style> 