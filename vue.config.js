module.exports = {
  devServer: {
    host: 'localhost',
    port: 1984,
    proxy: {
      '/mini': {
        target: 'http://localhost:2005',
        changeOrigin: true
      }
    }
  }
}
