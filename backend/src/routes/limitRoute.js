const express = require('express');
const router = express.Router();
const limitController = require('../controllers/limit.controller');

router.post('/', limitController.setMonthlyLimit);         // Thiết lập/Cập nhật định mức
router.get('/:userId/:month/:year', limitController.getMonthlyLimit); // Lấy định mức

module.exports = router;