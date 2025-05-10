// import express from 'express';
// import { createProxyMiddleware } from 'http-proxy-middleware';

// const router = express.Router();
// const serviceUrl = process.env.WAREHOUSE_SERVICE_URL || 'http://localhost:5004';

// router.use(
//   '/',
//   createProxyMiddleware({
//     target: serviceUrl,
//     changeOrigin: true,
//     pathRewrite: { '^/api/warehouses': '/api/warehouses' },
//   })
// );

// export default router;
