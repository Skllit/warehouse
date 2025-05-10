import express from 'express';
import bodyParser from 'body-parser';
import productRoutes from './routes/product.routes';
import { connectDB } from './config/db';

const app = express();

// Connect to DB
connectDB();
import cors from 'cors';

app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET','POST','PUT','DELETE','OPTIONS'],
    allowedHeaders: ['Content-Type','Authorization']
}));
// Middleware
app.use(bodyParser.json());

// Routes
app.use('/api/products', productRoutes);

export default app;
