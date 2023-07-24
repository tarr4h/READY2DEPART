const {createProxyMiddleware} = require('http-proxy-middleware')


module.exports = app => {

    const urlPaths = ['/auth', '/register', '/board', '/district', '/pln'];

    app.use(
        createProxyMiddleware(urlPaths, {
            target: 'http://localhost:8082',
            changeOrigin: true,
        })
    )
}