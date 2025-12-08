import express from 'express';
import cors from 'cors';
import { testDbConnection } from './db';
import authRoutes from './routes/authRoutes';
import categoryRoutes from './routes/categoryRoutes';
import transactionRoutes from './routes/transactionRoutes';
import budgetRoutes from './routes/budgetRoutes';
import reportRoutes from './routes/reportRoutes';

const app = express();
app.use(express.json());
app.use(cors());

app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/reports', reportRoutes);

const PORT = 5000;

const startServer = async () => {
    await testDbConnection();
    app.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
    });
};

startServer();