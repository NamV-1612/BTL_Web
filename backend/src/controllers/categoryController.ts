import { Response } from 'express';
import pool from '../db';
import { AuthRequest } from '../middleware/authMiddleware';

export const getCategories = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;
        const [rows] = await pool.query(
            `SELECT category_id as id, name, limit_amount as 'limit', is_default, user_id 
             FROM categories 
             WHERE user_id = ? OR is_default = 1`, 
            [userId]
        );
        res.json(rows);
    } catch (error) {
        res.status(500).json(error);
    }
};

export const addCategory = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;
        const { name, limit } = req.body;
        await pool.query(
            'INSERT INTO categories (user_id, name, limit_amount, is_default) VALUES (?, ?, ?, 0)',
            [userId, name, limit || 0]
        );
        res.status(201).json({ message: 'Category added' });
    } catch (error) {
        res.status(500).json(error);
    }
};

// --- ĐOẠN SỬA QUAN TRỌNG Ở ĐÂY ---
export const updateCategory = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;
        const { id } = req.params;
        const { name, limit } = req.body;

        // 1. Kiểm tra danh mục này là của ai? Có phải mặc định không?
        const [rows]: any = await pool.query('SELECT user_id, is_default FROM categories WHERE category_id = ?', [id]);
        
        if (rows.length === 0) return res.status(404).json({ message: 'Category not found' });
        
        const cat = rows[0];

        // 2. Xử lý logic cập nhật
        if (cat.is_default === 1) {
            // NẾU LÀ MẶC ĐỊNH: Chỉ cho phép cập nhật limit (Hạn mức), KHÔNG cập nhật name
            await pool.query(
                'UPDATE categories SET limit_amount = ? WHERE category_id = ?', 
                [limit, id]
            );
        } else {
            // NẾU LÀ DANH MỤC THƯỜNG: Phải đúng chủ sở hữu mới được sửa
            if (cat.user_id !== userId) {
                return res.status(403).json({ message: 'Access denied' });
            }
            // Cho phép sửa cả Tên và Hạn mức
            await pool.query(
                'UPDATE categories SET name = ?, limit_amount = ? WHERE category_id = ?', 
                [name, limit, id]
            );
        }

        res.json({ message: 'Category updated' });
    } catch (error) {
        console.error(error);
        res.status(500).json(error);
    }
};

export const deleteCategory = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;
        const { id } = req.params;
        const [rows]: any = await pool.query('SELECT user_id, is_default FROM categories WHERE category_id = ?', [id]);
        
        if (rows.length === 0) return res.status(404).json({ message: 'Category not found' });
        
        if (rows[0].is_default === 1) return res.status(403).json({ message: 'Cannot delete default categories' });
        
        if (rows[0].user_id !== userId) return res.status(403).json({ message: 'Access denied' });

        await pool.query(
            `UPDATE transactions SET category_name = 'Other', category_id = NULL WHERE category_id = ?`, 
            [id]
        );
        
        await pool.query('DELETE FROM categories WHERE category_id = ?', [id]);
        res.json({ message: 'Category deleted' });
    } catch (error) {
        res.status(500).json(error);
    }
};