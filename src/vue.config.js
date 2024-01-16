module.exports = {
    devServer: {
      proxy: {
        '/ws': {
          target: 'http://localhost:8080', // Spring Boot 서버 주소
          ws: true,
          changeOrigin: true
        }
      }
    }
  }