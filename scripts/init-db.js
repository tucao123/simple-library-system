const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');

// 数据库连接配置（请先修改为你的实际配置）
const config = {
  host: 'localhost',
  user: 'root',
  password: '',  // 修改为你的 MySQL 密码
  multipleStatements: true
};

console.log('正在连接 MySQL...');

const connection = mysql.createConnection(config);

connection.connect((err) => {
  if (err) {
    console.error('❌ MySQL 连接失败，请检查：');
    console.error('   1. MySQL 服务是否已启动');
    console.error('   2. 用户名密码是否正确');
    console.error('   3. 在 scripts/init-db.js 中修改配置');
    console.error(`   错误信息: ${err.message}`);
    process.exit(1);
  }

  console.log('✅ MySQL 连接成功');

  // 读取 SQL 文件
  const sqlFile = path.join(__dirname, '..', 'sql', 'init.sql');
  const sql = fs.readFileSync(sqlFile, 'utf8');

  console.log('正在执行 SQL 脚本...');

  connection.query(sql, (err, results) => {
    if (err) {
      console.error('❌ SQL 执行失败:', err.message);
      connection.end();
      process.exit(1);
    }

    console.log('✅ 数据库初始化完成！');
    console.log('');
    console.log('数据库: library_db');
    console.log('表: book_info, book_type');
    console.log('测试数据: 8 条图书记录，8 种图书类型');
    console.log('');

    // 验证数据
    connection.query('SELECT COUNT(*) as count FROM library_db.book_info', (err, results) => {
      if (!err) {
        console.log(`✅ 验证: book_info 表有 ${results[0].count} 条记录`);
      }
      connection.query('SELECT COUNT(*) as count FROM library_db.book_type', (err, results) => {
        if (!err) {
          console.log(`✅ 验证: book_type 表有 ${results[0].count} 条记录`);
        }
        console.log('');
        console.log('现在可以运行 npm start 启动应用');
        connection.end();
      });
    });
  });
});
