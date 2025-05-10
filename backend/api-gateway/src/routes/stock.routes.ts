// import express from 'express';
// import { createProxyMiddleware } from 'http-proxy-middleware';

// const router = express.Router();
// const serviceUrl = process.env.STOCK_SERVICE_URL || 'http://localhost:5006';

// router.use(
//   '/',
//   createProxyMiddleware({
//     target: serviceUrl,
//     changeOrigin: true,
//     pathRewrite: { '^/api/stock': '/api/stock' },
//   })
// );

// export default router;
