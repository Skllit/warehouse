// server.js (or server.ts compiled to JS)
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = 3000;     // <— pick a browser-safe port

app.use(
  '/api/sales',
  createProxyMiddleware({
    target: 'http://127.0.0.1:5006',  // no need to include /api/sales here
    changeOrigin: true,
  })
);

app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});
