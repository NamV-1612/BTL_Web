import { Router } from 'express';
import { getCategories, addCategory, updateCategory, deleteCategory } from '../controllers/categoryController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

router.get('/', authenticateToken, getCategories);
router.post('/', authenticateToken, addCategory);
router.put('/:id', authenticateToken, updateCategory);
router.delete('/:id', authenticateToken, deleteCategory);

export default router;