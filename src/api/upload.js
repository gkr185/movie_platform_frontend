import request from '@/utils/request'

// 文件上传API
export const fileUploadApi = {
  // 上传单个文件
  uploadFile(file, category, relatedId = null) {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('category', category)
    if (relatedId) {
      formData.append('relatedId', relatedId)
    }

    return request({
      url: '/api/files/upload',
      method: 'post',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      timeout: 60000 // 60秒超时时间，适合文件上传
    })
  },

  // 上传文件并更新数据库
  uploadAndUpdate(file, category, relatedId, urlType) {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('category', category)
    formData.append('relatedId', relatedId)
    formData.append('urlType', urlType)

    return request({
      url: '/api/files/upload-and-update',
      method: 'post',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      timeout: 60000 // 60秒超时时间，适合文件上传
    })
  },

  // 批量上传文件
  uploadBatch(files, category, relatedId = null) {
    const formData = new FormData()
    files.forEach(file => {
      formData.append('files', file)
    })
    formData.append('category', category)
    if (relatedId) {
      formData.append('relatedId', relatedId)
    }

    return request({
      url: '/api/files/upload/batch',
      method: 'post',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      timeout: 120000 // 120秒超时时间，适合批量上传
    })
  },

  // 根据分类获取文件列表
  getFilesByCategory(category) {
    return request({
      url: `/api/files/category/${category}`,
      method: 'get'
    })
  },

  // 根据关联ID获取文件列表
  getFilesByRelatedId(relatedId) {
    return request({
      url: `/api/files/related/${relatedId}`,
      method: 'get'
    })
  },

  // 根据分类和关联ID获取文件列表
  getFilesByCategoryAndRelatedId(category, relatedId) {
    return request({
      url: `/api/files/category/${category}/related/${relatedId}`,
      method: 'get'
    })
  },

  // 删除文件
  deleteFile(fileId) {
    return request({
      url: `/api/files/${fileId}`,
      method: 'delete'
    })
  },

  // 根据文件名获取文件信息
  getFileByName(fileName) {
    return request({
      url: `/api/files/filename/${fileName}`,
      method: 'get'
    })
  },

  // 获取所有文件列表
  getAllFiles() {
    return request({
      url: '/api/files/all',
      method: 'get'
    })
  },

  // 健康检查
  healthCheck() {
    return request({
      url: '/api/files/health',
      method: 'get'
    })
  }
}

// 文件上传工具函数
export const fileUploadUtils = {
  // 支持的文件类型
  fileTypes: {
    image: ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'],
    video: ['mp4', 'avi', 'mov', 'wmv', 'flv', 'mkv', 'webm']
  },

  // 验证文件类型
  validateFileType(file, allowedTypes) {
    const extension = file.name.split('.').pop().toLowerCase()
    return allowedTypes.includes(extension)
  },

  // 验证文件大小
  validateFileSize(file, maxSize) {
    return file.size <= maxSize
  },

  // 格式化文件大小
  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  },

  // 生成文件预览URL
  getPreviewUrl(file) {
    return URL.createObjectURL(file)
  },

  // 检查是否为图片文件
  isImageFile(file) {
    return this.validateFileType(file, this.fileTypes.image)
  },

  // 检查是否为视频文件
  isVideoFile(file) {
    return this.validateFileType(file, this.fileTypes.video)
  }
}

export default fileUploadApi 