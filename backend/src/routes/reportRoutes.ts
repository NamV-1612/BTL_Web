import { Router } from 'express';
import { getMonthlyReport, getAnnualReport } from '../controllers/reportController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

router.get('/monthly', authenticateToken, getMonthlyReport);
router.get('/annual', authenticateToken, getAnnualReport);

export default router;