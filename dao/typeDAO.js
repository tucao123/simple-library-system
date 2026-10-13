const pool = require('../config/db');

const typeDAO = {
  // 获取所有图书类型
  async findAll() {
    const [rows] = await pool.execute('SELECT * FROM book_type ORDER BY id');
    return rows;
  }
};

module.exports = typeDAO;
