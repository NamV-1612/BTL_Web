import { Response } from 'express';
import pool from '../db';
import { AuthRequest } from '../middleware/authMiddleware';

export const getMonthlyReport = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;
        const { month, year } = req.query;

        const [totals]: any = await pool.query(
            `SELECT 
                SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as total_expense,
                SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as total_income
             FROM transactions 
             WHERE user_id = ? AND MONTH(transaction_date) = ? AND YEAR(transaction_date) = ?`,
            [userId, month, year]
        );

        const [breakdown]: any = await pool.query(
            `SELECT category_name as name, SUM(amount) as value 
             FROM transactions 
             WHERE user_id = ? AND type = 'expense' AND MONTH(transaction_date) = ? AND YEAR(transaction_date) = ?
             GROUP BY category_name`,
            [userId, month, year]
        );

        res.json({
            income: totals[0].total_income || 0,
            expense: totals[0].total_expense || 0,
            breakdown
        });
    } catch (error) {
        res.status(500).json(error);
    }
};

export const getAnnualReport = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;
        const { year } = req.query;

        const query = `
            SELECT 
                months.m as name,
                COALESCE(t.spent, 0) as spent,
                COALESCE(b.limit_amount, 0) as 'limit'
            FROM 
                (SELECT 1 as m UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 
                 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 
                 UNION SELECT 9 UNION SELECT 10 UNION SELECT 11 UNION SELECT 12) as months
            LEFT JOIN 
                (SELECT MONTH(transaction_date) as m, SUM(amount) as spent 
                 FROM transactions 
                 WHERE user_id = ? AND type = 'expense' AND YEAR(transaction_date) = ? 
                 GROUP BY m) as t ON months.m = t.m
            LEFT JOIN 
                budgets b ON months.m = b.month AND b.year = ? AND b.user_id = ?
            ORDER BY months.m ASC;
        `;

        const [rows] = await pool.query(query, [userId, year, year, userId]);
        
        const formattedRows = (rows as any[]).map(r => ({
            ...r,
            name: `T${r.name}`, 
            spent: Number(r.spent),
            limit: Number(r.limit) 
        }));

        res.json(formattedRows);
    } catch (error) {
        console.error(error);
        res.status(500).json(error);
    }
};