module.exports = {
  devServer: {
    host: 'localhost',
    port: 8080,
    proxy: {
      '/mini': {
        target: 'http://localhost:2005',
        changeOrigin: true
      }
    }
  }
}
