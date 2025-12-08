import { Response } from 'express';
import pool from '../db';
import { AuthRequest } from '../middleware/authMiddleware';

export const getBudget = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;
        const { month, year } = req.query;

        // Tìm trong DB xem tháng này có dòng nào không
        const [rows]: any = await pool.query(
            'SELECT limit_amount FROM budgets WHERE user_id = ? AND month = ? AND year = ?',
            [userId, month, year]
        );

        // Nếu có: Trả về số tiền. 
        // Nếu không (mảng rỗng): Trả về 0 (ĐÂY LÀ CHỖ QUAN TRỌNG)
        if (rows.length > 0) {
            res.json({ limit: rows[0].limit_amount });
        } else {
            res.json({ limit: 0 }); // Mặc định trả về 0 nếu chưa set
        }
    } catch (error) {
        res.status(500).json(error);
    }
};

export const setBudget = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;
        const { month, year, limit } = req.body;

        // Câu lệnh SQL "Thần thánh":
        // Nếu chưa có dòng (user, month, year) -> INSERT
        // Nếu đã có dòng đó (trùng UNIQUE KEY) -> UPDATE limit_amount
        await pool.query(
            `INSERT INTO budgets (user_id, month, year, limit_amount) 
             VALUES (?, ?, ?, ?) 
             ON DUPLICATE KEY UPDATE limit_amount = VALUES(limit_amount)`,
            [userId, month, year, limit]
        );

        res.json({ message: 'Budget set successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json(error);
    }
};