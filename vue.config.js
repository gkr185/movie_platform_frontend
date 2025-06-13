const { defineConfig } = require('@vue/cli-service')
require('events').EventEmitter.defaultMaxListeners = 0; // 解除限制

module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    proxy: {
      '/api/payment': {
        target: 'http://localhost:8066',
        changeOrigin: true,
        pathRewrite: {
          '^/api/payment': '/api/payment'
        }
      },
      '/api/movies': {
        target: 'http://localhost:8061',
        changeOrigin: true,
        pathRewrite: {
          '^/api/movies': '/api/movies'
        }
      },
      '/api/users': {
        target: 'http://localhost:8062',
        changeOrigin: true,
        pathRewrite: {
          '^/api/users': '/api/users'
        }
      },
      '/api/categories': {
        target: 'http://localhost:8063',
        changeOrigin: true,
        pathRewrite: {
          '^/api/categories': '/api/categories'
        }
      },
      '/api/comments': {
        target: 'http://localhost:8061',
        changeOrigin: true,
        pathRewrite: {
          '^/api/comments': '/api/comments'
        }
      },
      '/api/favorites': {
        target: 'http://localhost:8061',
        changeOrigin: true,
        pathRewrite: {
          '^/api/favorites': '/api/favorites'
        }
      },
      '/api/history': {
        target: 'http://localhost:8061',
        changeOrigin: true,
        pathRewrite: {
          '^/api/history': '/api/history'
        }
      },
      '/api/news': {
        target: 'http://localhost:8064',
        changeOrigin: true,
        pathRewrite: {
          '^/api/news': '/api/news'
        }
      },
      '/api/advertisements': {
        target: 'http://localhost:8065',
        changeOrigin: true,
        pathRewrite: {
          '^/api/advertisements': '/api/advertisements'
        }
      }
    }
  }
})
