// import express from 'express';
// import dotenv from 'dotenv';
// import authRoutes from './routes/auth.routes';
// import companyRoutes from './routes/company.routes';
// import productRoutes from './routes/product.routes';
// import warehouseRoutes from './routes/warehouse.routes';
// import branchRoutes from './routes/branch.routes';
// import stockRoutes from './routes/stock.routes';
// import salesRoutes from './routes/sales.routes';

// dotenv.config();
// const app = express();

// app.use(express.json());

// // Mount proxy routes
// app.use('/api/auth', authRoutes);
// app.use('/api/company', companyRoutes);
// app.use('/api/products', productRoutes);
// app.use('/api/warehouses', warehouseRoutes);
// app.use('/api/branches', branchRoutes);
// app.use('/api/stock', stockRoutes);
// app.use('/api/sales', salesRoutes);

// // Health check
// app.get('/', (req, res) => {
//   res.send('API Gateway is running 🚀');
// });

// export default app;
