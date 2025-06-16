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
      },
      '/api/files': {
        target: 'http://localhost:8068',
        changeOrigin: true,
        pathRewrite: {
          '^/api/files': '/api/files'
        }
      },
      '/uploads': {
        target: 'http://localhost:8068',
        changeOrigin: true,
        secure: false,
        logLevel: 'debug',
        pathRewrite: {
          '^/uploads': '/uploads'
        },
        onProxyRes: function(proxyRes, req, res) {
          // 确保响应包含 CORS 头
          proxyRes.headers['Access-Control-Allow-Origin'] = '*';
          proxyRes.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
          proxyRes.headers['Access-Control-Allow-Headers'] = '*';
          // 对于视频文件，添加范围请求支持
          if (req.url.includes('.mp4') || req.url.includes('.avi') || req.url.includes('.mov')) {
            proxyRes.headers['Accept-Ranges'] = 'bytes';
            proxyRes.headers['Cache-Control'] = 'no-cache';
          }
        }
      }
    }
  }
})
