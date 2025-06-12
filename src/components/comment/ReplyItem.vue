<template>
  <comment-item
    :comment="comment"
    :movie-id="movieId"
    :is-reply="true"
    @reply-success="handleReplySuccess"
    @delete-success="handleDeleteSuccess"
  />
</template>

<script>
import CommentItem from './CommentItem.vue'

export default {
  name: 'ReplyItem',
  
  components: {
    CommentItem
  },
  
  props: {
    comment: {
      type: Object,
      required: true,
      validator(value) {
        if (!value || !value.id) {
          console.error('[ReplyItem] Invalid comment object:', value)
          return false
        }
        if (!value.parentId) {
          console.warn('[ReplyItem] Reply comment without parentId:', value)
        }
        return true
      }
    },
    movieId: {
      type: [Number, String],
      required: true,
      validator(value) {
        if (!value) {
          console.error('[ReplyItem] movieId is required but got:', value)
          return false
        }
        return true
      }
    }
  },

  created() {
    console.log('[ReplyItem] Initialized with:', {
      commentId: this.comment.id,
      parentId: this.comment.parentId,
      movieId: this.movieId
    })
  },

  methods: {
    handleReplySuccess() {
      console.log('[ReplyItem] Reply submitted successfully for comment:', this.comment.id)
      this.$emit('reply-success')
    },

    handleDeleteSuccess() {
      console.log('[ReplyItem] Reply deleted successfully:', this.comment.id)
      this.$emit('delete-success')
    }
  },

  beforeUnmount() {
    console.log('[ReplyItem] Component unmounting, reply:', this.comment.id)
  }
}
</script>
