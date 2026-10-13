const pool = require('../config/db');

const bookDAO = {
  // 查询所有图书（分页 + 模糊搜索 + 按入库时间降序）
  async findAll(searchTerm = '', page = 1, pageSize = 5) {
    const offset = (page - 1) * pageSize;
    
    let sql = `
      SELECT b.*, t.typeName 
      FROM book_info b 
      LEFT JOIN book_type t ON b.bookType = t.id
    `;
    let countSql = 'SELECT COUNT(*) as total FROM book_info';
    const params = [];
    const countParams = [];

    if (searchTerm) {
      sql += ' WHERE b.bookName LIKE ?';
      countSql += ' WHERE bookName LIKE ?';
      params.push(`%${searchTerm}%`);
      countParams.push(`%${searchTerm}%`);
    }

    sql += ' ORDER BY b.creationTime DESC LIMIT ? OFFSET ?';
    params.push(pageSize, offset);

    const [rows] = await pool.execute(sql, params);
    const [countResult] = await pool.execute(countSql, countParams);
    
    return {
      books: rows,
      total: countResult[0].total,
      page: parseInt(page),
      pageSize,
      totalPages: Math.ceil(countResult[0].total / pageSize)
    };
  },

  // 根据 ID 查找图书详情
  async findById(id) {
    const sql = `
      SELECT b.*, t.typeName 
      FROM book_info b 
      LEFT JOIN book_type t ON b.bookType = t.id 
      WHERE b.bookId = ?
    `;
    const [rows] = await pool.execute(sql, [id]);
    return rows[0] || null;
  },

  // 新增图书
  async create(bookData) {
    const sql = `
      INSERT INTO book_info 
        (bookCode, bookName, bookType, bookAuthor, publishPress, publishDate, borrowed, createdBy, creationTime)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
    `;
    const params = [
      bookData.bookCode,
      bookData.bookName,
      bookData.bookType,
      bookData.bookAuthor,
      bookData.publishPress,
      bookData.publishDate,
      bookData.borrowed || 0,
      bookData.createdBy || 'admin'
    ];
    const [result] = await pool.execute(sql, params);
    return result.insertId;
  },

  // 修改图书信息
  async update(id, bookData) {
    const sql = `
      UPDATE book_info 
      SET bookCode = ?, bookName = ?, bookType = ?, bookAuthor = ?, 
          publishPress = ?, publishDate = ?, borrowed = ?, lastUpdatetime = NOW()
      WHERE bookId = ?
    `;
    const params = [
      bookData.bookCode,
      bookData.bookName,
      bookData.bookType,
      bookData.bookAuthor,
      bookData.publishPress,
      bookData.publishDate,
      bookData.borrowed,
      id
    ];
    const [result] = await pool.execute(sql, params);
    return result.affectedRows > 0;
  },

  // 删除图书
  async delete(id) {
    const sql = 'DELETE FROM book_info WHERE bookId = ?';
    const [result] = await pool.execute(sql, [id]);
    return result.affectedRows > 0;
  },

  // 借阅状态统计（总数 / 已借 / 未借）
  async getBorrowStats() {
    const sql = `
      SELECT
        COUNT(*) AS total,
        COALESCE(SUM(CASE WHEN borrowed = 1 THEN 1 ELSE 0 END), 0) AS borrowedCount,
        COALESCE(SUM(CASE WHEN borrowed = 0 THEN 1 ELSE 0 END), 0) AS availableCount
      FROM book_info
    `;
    const [rows] = await pool.execute(sql);
    const r = rows[0] || {};
    return {
      total: Number(r.total) || 0,
      borrowedCount: Number(r.borrowedCount) || 0,
      availableCount: Number(r.availableCount) || 0
    };
  },

  // 按图书类型统计（含该类型借阅数）
  async getTypeStats() {
    const sql = `
      SELECT t.typeName,
             COUNT(b.bookId) AS total,
             COALESCE(SUM(CASE WHEN b.borrowed = 1 THEN 1 ELSE 0 END), 0) AS borrowedCount
      FROM book_type t
      LEFT JOIN book_info b ON b.bookType = t.id
      GROUP BY t.id, t.typeName
      ORDER BY total DESC, t.id ASC
    `;
    const [rows] = await pool.execute(sql);
    return rows.map(r => ({
      typeName: r.typeName,
      total: Number(r.total) || 0,
      borrowedCount: Number(r.borrowedCount) || 0,
      availableCount: (Number(r.total) || 0) - (Number(r.borrowedCount) || 0)
    }));
  }
};

module.exports = bookDAO;
