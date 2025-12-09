import { Response } from 'express';
import pool from '../db';
import { AuthRequest } from '../middleware/authMiddleware';

export const getBudget = async (req: AuthRequest, res: Response) => {
    try { // lệnh try để check nếu tháng đó đã set đ/m
        const userId = req.user?.userId;
        const { month, year } = req.query;

        const [rows]: any = await pool.query(
            'SELECT limit_amount FROM budgets WHERE user_id = ? AND month = ? AND year = ?',
            [userId, month, year]
        );

        if (rows.length > 0) {
            res.json({ limit: rows[0].limit_amount });
        } else {
            res.json({ limit: 0 }); 
        }
    } 
    catch (error) {
        res.status(500).json(error);
    }
};

export const setBudget = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;
        const { month, year, limit } = req.body;
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