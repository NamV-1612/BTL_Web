import { Request, Response } from 'express';
import pool from '../db'; // Lưu ý: Nếu dùng ts-node thì import pool from '../db' là đủ, không cần .js
import jwt from 'jsonwebtoken';

// --- ĐĂNG KÝ ---
export const register = async (req: Request, res: Response) => {
    const { username, email, password } = req.body;

    if (!username || !password || !email) {
        return res.status(400).send({ message: 'Vui lòng nhập đủ thông tin.' });
    }

    if (password.length < 8) {
        return res.status(400).send({ message: 'Mật khẩu phải có tối thiểu 8 ký tự.' });
    }

    try {
        const [existingUser]: any = await pool.execute(
            'SELECT user_id FROM users WHERE username = ?', 
            [username]
        );

        if (existingUser.length > 0) {
            return res.status(409).send({ message: 'Tên người dùng đã tồn tại.' });
        }

        // --- SỬA CHỖ NÀY: password_hash -> password ---
        const [result]: any = await pool.execute(
            'INSERT INTO users (username, email, password, auth_provider) VALUES (?, ?, ?, ?)', 
            [username, email, password, 'local'] 
        );

        res.status(201).send({ message: 'Đăng ký thành công.', userId: result.insertId });

    } catch (error) {
        console.error("Lỗi đăng ký:", error);
        res.status(500).send({ message: 'Lỗi server khi đăng ký.' });
    }
};

// --- ĐĂNG NHẬP ---
export const login = async (req: Request, res: Response) => {
    const { username, password } = req.body;
    
    try {
        // --- SỬA CHỖ NÀY: Lấy cột password ---
        const [users]: any = await pool.execute(
            'SELECT user_id, username, email, password FROM users WHERE username = ?', 
            [username]
        );

        if (users.length === 0) {
            return res.status(401).send({ message: 'Tên người dùng không tồn tại.' });
        }

        const user = users[0];

        // --- SỬA CHỖ NÀY: So sánh với user.password ---
        if (password === user.password) {
            
            const token = jwt.sign(
                { userId: user.user_id, username: user.username }, 
                process.env.JWT_SECRET as string || 'secret',
                { expiresIn: '24h' }
            );

            return res.status(200).send({ 
                message: 'Đăng nhập thành công.', 
                token: token,
                user: {
                    userId: user.user_id,
                    username: user.username,
                    email: user.email
                }
            });
        } else {
            return res.status(401).send({ message: 'Mật khẩu không đúng.' });
        }

    } catch (error) {
        console.error("Lỗi đăng nhập:", error);
        res.status(500).send({ message: 'Lỗi server khi đăng nhập.' });
    }
};