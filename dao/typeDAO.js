const pool = require('../config/db');

const typeDAO = {
  // 获取所有图书类型
  async findAll() {
    const [rows] = await pool.execute('SELECT * FROM book_type ORDER BY id');
    return rows;
  },

  // 获取所有图书类型（含每种类型的图书数量）
  async findAllWithCount() {
    const sql = `
      SELECT t.id, t.typeName, COUNT(b.bookId) AS bookCount
      FROM book_type t
      LEFT JOIN book_info b ON b.bookType = t.id
      GROUP BY t.id, t.typeName
      ORDER BY t.id
    `;
    const [rows] = await pool.execute(sql);
    return rows;
  },

  async findById(id) {
    const [rows] = await pool.execute('SELECT * FROM book_type WHERE id = ?', [id]);
    return rows[0] || null;
  },

  async create(typeName) {
    const [result] = await pool.execute(
      'INSERT INTO book_type (typeName) VALUES (?)',
      [typeName]
    );
    return result.insertId;
  },

  async update(id, typeName) {
    const [result] = await pool.execute(
      'UPDATE book_type SET typeName = ? WHERE id = ?',
      [typeName, id]
    );
    return result.affectedRows > 0;
  },

  async delete(id) {
    const [result] = await pool.execute('DELETE FROM book_type WHERE id = ?', [id]);
    return result.affectedRows > 0;
  },

  // 该类型下的图书数量（外键为 ON DELETE RESTRICT，需先检查）
  async countBooks(id) {
    const [rows] = await pool.execute(
      'SELECT COUNT(*) AS cnt FROM book_info WHERE bookType = ?',
      [id]
    );
    return rows[0].cnt;
  }
};

module.exports = typeDAO;
