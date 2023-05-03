const {createProxyMiddleware} = require('http-proxy-middleware')


module.exports = app => {

    const urlPaths = ['/auth', '/register', '/board'];

    app.use(
        createProxyMiddleware(urlPaths, {
            target: 'http://localhost:8081',
            changeOrigin: true,
        })
    )
}