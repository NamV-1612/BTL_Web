const db = require('../config/db.config');

exports.register = async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).send({ message: 'Tên người dùng và mật khẩu là bắt buộc.' });
    }

    try {
        // Kiểm tra người dùng đã tồn tại chưa
        const [existingUser] = await db.execute('SELECT id FROM users WHERE username = ?', [username]);
        if (existingUser.length > 0) {
            return res.status(409).send({ message: 'Tên người dùng đã tồn tại.' });
        }

        // Tạo người dùng mới
        const [result] = await db.execute('INSERT INTO users (username, password) VALUES (?, ?)', [username, password]);
        res.status(201).send({ message: 'Đăng ký thành công.', userId: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Lỗi khi đăng ký.' });
    }
};


exports.login = async (req, res) => {
    const { username, password } = req.body;
    
    try {
        // Tìm người dùng theo username
        const [users] = await db.execute('SELECT id, username, password FROM users WHERE username = ?', [username]);

        if (users.length === 0) {
            return res.status(401).send({ message: 'Tên người dùng hoặc mật khẩu không đúng.' });
        }

        const user = users[0];

        // So sánh mật khẩu 
        if (password === user.password) {
            return res.status(200).send({ 
                message: 'Đăng nhập thành công.', 
                userId: user.id 
            });
        } else {
            return res.status(401).send({ message: 'Tên người dùng hoặc mật khẩu không đúng.' });
        }

    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Lỗi server khi đăng nhập.' });
    }
};