const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expense.controller');

router.get('/:userId', expenseController.getExpenses); // Lấy danh sách (có thể lọc tháng/năm)
router.post('/', expenseController.addExpense);        // Thêm mới
router.put('/:id', expenseController.updateExpense);   // Sửa
router.delete('/:id', expenseController.deleteExpense); // Xóa

module.exports = router;