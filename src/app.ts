import express from 'express';
import transactionRoutes from './routes/transactionRoutes';

const app = express();

app.use(express.json());
app.use('/transactionservice', transactionRoutes);

export default app
