const db = require('../config/db.config');

// Lấy tất cả danh mục của một người dùng
exports.getCategories = async (req, res) => {
    const { userId } = req.params;
    try {
        const [categories] = await db.execute('SELECT id, name FROM categories WHERE user_id = ?', [userId]);
        res.status(200).send(categories);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Lỗi server khi lấy danh mục.' });
    }
};

// Thêm danh mục mới
exports.addCategory = async (req, res) => {
    const { userId, name } = req.body;
    try {
        const [result] = await db.execute('INSERT INTO categories (user_id, name) VALUES (?, ?)', [userId, name]);
        res.status(201).send({ message: 'Thêm danh mục thành công.', categoryId: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Lỗi server khi thêm danh mục.' });
    }
};

// Sửa tên danh mục
exports.updateCategory = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    try {
        const [result] = await db.execute('UPDATE categories SET name = ? WHERE id = ?', [name, id]);
        if (result.affectedRows === 0) {
            return res.status(404).send({ message: 'Không tìm thấy danh mục.' });
        }
        res.status(200).send({ message: 'Cập nhật danh mục thành công.' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Lỗi server khi cập nhật danh mục.' });
    }
};

// Xóa danh mục
exports.deleteCategory = async (req, res) => {
    const { id } = req.params;
    try {
        // Khi xóa danh mục, các khoản chi tiêu liên quan sẽ được xóa nhờ ON DELETE CASCADE
        const [result] = await db.execute('DELETE FROM categories WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).send({ message: 'Không tìm thấy danh mục.' });
        }
        res.status(200).send({ message: 'Xóa danh mục thành công.' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Lỗi server khi xóa danh mục.' });
    }
};