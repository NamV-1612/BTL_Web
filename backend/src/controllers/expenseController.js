

// Lấy tất cả chi tiêu của một người dùng trong một tháng 
exports.getExpenses = async (req, res) => {
    const { userId } = req.params;
    const { month, year } = req.query; 

    let query = 'SELECT e.id, c.name as category_name, e.type, e.amount, e.expense_date, e.note FROM expenses e JOIN categories c ON e.category_id = c.id WHERE e.user_id = ?';
    const params = [userId];

    if (month && year) {
        query += ' AND MONTH(e.expense_date) = ? AND YEAR(e.expense_date) = ?';
        params.push(month, year);
    }
    query += ' ORDER BY e.expense_date DESC';

    try {
        const [expenses] = await db.execute(query, params);
        res.status(200).send(expenses);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Lỗi server khi lấy chi tiêu.' });
    }
};

// Sửa khoản chi tiêu
exports.updateExpense = async (req, res) => {
    const { id } = req.params;
    const { category_id, type, amount, expense_date, note } = req.body;
    
    try {
        const [result] = await db.execute(
            'UPDATE expenses SET category_id = ?, type = ?, amount = ?, expense_date = ?, note = ? WHERE id = ?',
            [category_id, type, amount, expense_date, note, id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).send({ message: 'Không tìm thấy khoản chi tiêu.' });
        }
        // *Lưu ý: Nếu sửa, cần chạy lại logic cảnh báo định mức 
        res.status(200).send({ message: 'Cập nhật chi tiêu thành công.' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Lỗi server khi cập nhật chi tiêu.' });
    }
};

// Xóa khoản chi tiêu
exports.deleteExpense = async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await db.execute('DELETE FROM expenses WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).send({ message: 'Không tìm thấy khoản chi tiêu.' });
        }
        // Sau khi xóa, có thể cần chạy lại logic cảnh báo định mức.
        res.status(200).send({ message: 'Xóa khoản chi tiêu thành công.' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Lỗi server khi xóa chi tiêu.' });
    }
};