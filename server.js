require('./server.babel'); // babel registration (runtime transpilation for node)
const express = require('express')
const compression = require('compression')
const app = express();
const path = require('path');
const proxyMiddleWare = require('http-proxy-middleware');

const { PORT, APIHOST, APIPORT } = process.env;

const proxyPath = `http://${APIHOST}:${APIPORT}`;// 后端服务地址
const proxyOption = {
  target: proxyPath,
  pathRewrite: {
    '^/api': ''
  }
};

app.all('/', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With');
  next();
})

app.use(compression())

app.listen(PORT || 8000, () => {
  console.log('app listening at http://%s:%s', '127.0.0.1', PORT);
});

app.use(express.static(path.join(__dirname, 'dist')));

// 代理接口
app.use('/api', proxyMiddleWare(proxyOption));

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

