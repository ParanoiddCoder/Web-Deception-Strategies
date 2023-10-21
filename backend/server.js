import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import connectDB from './config/db.js';
import pRoutes from './routes/productRoutes.js';

const port = process.env.PORT || 5000;

connectDB();

const app = express();//initialising express

app.get('/',(req,res) => {
    res.send('API is running...');
});

app.use('/api/products',pRoutes);

//starting the server
app.listen(port, () => console.log(`server running on port ${port}`));