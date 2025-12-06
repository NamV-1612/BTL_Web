const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller');

router.get('/:userId', categoryController.getCategories); // Lấy danh sách danh mục
router.post('/', categoryController.addCategory);       // Thêm danh mục
router.put('/:id', categoryController.updateCategory);  // Sửa danh mục
router.delete('/:id', categoryController.deleteCategory); // Xóa danh mục

module.exports = router;