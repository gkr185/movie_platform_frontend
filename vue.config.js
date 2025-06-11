const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    proxy: {
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
      }
    }
  }
})
