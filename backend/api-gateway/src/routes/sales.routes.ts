// import express from 'express';
// import { createProxyMiddleware } from 'http-proxy-middleware';

// const router = express.Router();
// const serviceUrl = process.env.SALES_SERVICE_URL || 'http://127.0.0.1:5006';

// router.use(
//   '/',
//   createProxyMiddleware({
//     target: serviceUrl,
//     changeOrigin: true,
//     pathRewrite: {
//         '^/': '/api/sales/',    // prepend `/api/sales/` so the sales-service sees the correct route
//       },
//   })
// );

// export default router;
