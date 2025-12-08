import { Router } from 'express';
import { getBudget, setBudget } from '../controllers/budgetController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

router.get('/', authenticateToken, getBudget);
router.post('/', authenticateToken, setBudget);

export default router;