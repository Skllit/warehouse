// import express from 'express';
// import { createProxyMiddleware } from 'http-proxy-middleware';

// const router = express.Router();

// const authServiceUrl = process.env.AUTH_SERVICE_URL || 'http://localhost:5001';

// router.use(
//   '/',
//   createProxyMiddleware({
//     target: authServiceUrl,
//     changeOrigin: true,
//     pathRewrite: { '^/api/auth': '/api/auth' },
//   })
// );

// export default router;
