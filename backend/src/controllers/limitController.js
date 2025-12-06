const db = require('../config/db.config');

// Thiết lập hoặc cập nhật định mức chi tiêu hàng tháng
exports.setMonthlyLimit = async (req, res) => {
    const { user_id, month, year, limit_amount } = req.body;

    // Sử dụng UPSERT (INSERT ... ON DUPLICATE KEY UPDATE) vì user_id, month, year là UNIQUE
    const query = `
        INSERT INTO monthly_limits (user_id, month, year, limit_amount)
        VALUES (?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE limit_amount = ?
    `;
    try {
        await db.execute(query, [user_id, month, year, limit_amount, limit_amount]);
        res.status(200).send({ message: 'Thiết lập định mức thành công.' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Lỗi server khi thiết lập định mức.' });
    }
};

// Lấy định mức chi tiêu hiện tại (tháng/năm cụ thể)
exports.getMonthlyLimit = async (req, res) => {
    const { userId, month, year } = req.params;
    try {
        const [limit] = await db.execute(
            'SELECT limit_amount FROM monthly_limits WHERE user_id = ? AND month = ? AND year = ?',
            [userId, month, year]
        );
        // Trả về 0 nếu không có định mức nào được thiết lập
        const limitAmount = limit.length > 0 ? limit[0].limit_amount : 0;
        res.status(200).send({ limit_amount: limitAmount });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Lỗi server khi lấy định mức.' });
    }
};