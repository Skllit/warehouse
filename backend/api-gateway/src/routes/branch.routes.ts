// import express from 'express';
// import { createProxyMiddleware } from 'http-proxy-middleware';

// const router = express.Router();
// const serviceUrl = process.env.BRANCH_SERVICE_URL || 'http://localhost:5005';

// router.use(
//   '/',
//   createProxyMiddleware({
//     target: serviceUrl,
//     changeOrigin: true,
//     pathRewrite: { '^/api/branches': '/api/branches' },
//   })
// );

// export default router;
