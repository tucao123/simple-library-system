const express = require('express');
const router = express.Router();
const bookDAO = require('../dao/bookDAO');
const typeDAO = require('../dao/typeDAO');

// 借阅统计看板
router.get('/', async (req, res) => {
  try {
    const borrowStats = await bookDAO.getBorrowStats();
    const typeStats = await bookDAO.getTypeStats();
    const typeCount = (await typeDAO.findAll()).length;

    res.render('dashboard', {
      borrowStats,
      typeStats,
      typeCount,
      borrowRate: borrowStats.total > 0
        ? ((borrowStats.borrowedCount / borrowStats.total) * 100).toFixed(1)
        : '0.0'
    });
  } catch (err) {
    console.error(err);
    res.status(500).render('error', { message: '获取统计数据失败' });
  }
});

module.exports = router;
