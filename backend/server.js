import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import connectDB from './config/db.js';
import { notFound,errorHandler } from './middleware/errorMiddleware.js';
import pRoutes from './routes/productRoutes.js';

const port = process.env.PORT || 5000;

connectDB();

const app = express();//initialising express

app.get('/',(req,res) => {
    res.send('API is running...');
});

app.use('/api/products',pRoutes);

app.use(notFound);
app.use(errorHandler);

//starting the server
app.listen(port, () => console.log(`server running on port ${port}`));