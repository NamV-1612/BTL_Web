import { Router } from 'express';
import { getTransactions, addTransaction, updateTransaction, deleteTransaction } from '../controllers/transactionController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

router.get('/', authenticateToken, getTransactions);
router.post('/', authenticateToken, addTransaction);
router.put('/:id', authenticateToken, updateTransaction);
router.delete('/:id', authenticateToken, deleteTransaction);

export default router;