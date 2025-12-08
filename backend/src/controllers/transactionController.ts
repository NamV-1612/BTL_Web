import { Response } from 'express';
import pool from '../db';
import { AuthRequest } from '../middleware/authMiddleware';

export const getTransactions = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;
        const [rows]: any = await pool.query(
            'SELECT * FROM transactions WHERE user_id = ? ORDER BY transaction_date DESC', 
            [userId]
        );

        const data = rows.map((r: any) => ({
            id: r.transaction_id,
            type: r.type,
            category: r.category_name,
            amount: r.amount,
            date: r.transaction_date,
            note: r.note
        }));

        res.json(data);
    } catch (error) {
        res.status(500).json(error);
    }
};

export const addTransaction = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;
        const { type, category, amount, date, note } = req.body;
        
        let categoryId = null;
        if (category) {
            const [catRows]: any = await pool.query(
                'SELECT category_id FROM categories WHERE name = ? AND (user_id = ? OR is_default = 1) LIMIT 1',
                [category, userId]
            );
            if (catRows.length > 0) {
                categoryId = catRows[0].category_id;
            }
        }

        await pool.query(
            `INSERT INTO transactions (user_id, category_id, category_name, amount, transaction_date, note, type) 
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [userId, categoryId, category, amount, date, note, type]
        );

        res.status(201).json({ message: 'Transaction added' });
    } catch (error) {
        res.status(500).json(error);
    }
};

export const updateTransaction = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;
        const { id } = req.params;
        const { category, amount, date, note } = req.body;

        let categoryId = null;
        if (category) {
            const [catRows]: any = await pool.query(
                'SELECT category_id FROM categories WHERE name = ? AND (user_id = ? OR is_default = 1) LIMIT 1',
                [category, userId]
            );
            if (catRows.length > 0) categoryId = catRows[0].category_id;
        }

        await pool.query(
            `UPDATE transactions 
             SET category_name = ?, category_id = ?, amount = ?, transaction_date = ?, note = ? 
             WHERE transaction_id = ? AND user_id = ?`,
            [category, categoryId, amount, date, note, id, userId]
        );

        res.json({ message: 'Transaction updated' });
    } catch (error) {
        res.status(500).json(error);
    }
};

export const deleteTransaction = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;
        const { id } = req.params;

        const [result]: any = await pool.query(
            'DELETE FROM transactions WHERE transaction_id = ? AND user_id = ?', 
            [id, userId]
        );

        if (result.affectedRows === 0) {
             return res.status(404).json({ message: 'Transaction not found or denied' });
        }

        res.json({ message: 'Transaction deleted' });
    } catch (error) {
        res.status(500).json(error);
    }
};