const express = require('express');
const router = express.Router();
const typeDAO = require('../dao/typeDAO');

// 获取所有图书类型（JSON API，供前端下拉框使用）
router.get('/', async (req, res) => {
  try {
    const types = await typeDAO.findAll();
    res.json(types);
  } catch (err) {
    res.status(500).json({ error: '获取图书类型失败' });
  }
});

module.exports = router;
