const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

// 加载 .env 文件（如果存在）
if (fs.existsSync(path.join(__dirname, '..', '.env'))) {
  require('dotenv').config();
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function main() {
  console.log('=== 图书管理系统 - 数据库初始化 ===\n');

  // 如果 .env 中已有配置，直接使用
  if (process.env.DB_PASSWORD) {
    console.log('✅ 检测到 .env 配置，直接使用\n');
  }

  const host = process.env.DB_HOST || await askQuestion(`MySQL 主机 (默认 localhost): `) || 'localhost';
  const user = process.env.DB_USER || await askQuestion(`MySQL 用户名 (默认 root): `) || 'root';
  const password = process.env.DB_PASSWORD || await askQuestion(`MySQL 密码: `);

  console.log('\n正在连接 MySQL...');

  const config = {
    host: host,
    user: user,
    password: password,
    multipleStatements: true
  };

  const connection = mysql.createConnection(config);

  return new Promise((resolve, reject) => {
    connection.connect((err) => {
      if (err) {
        console.error('\n❌ MySQL 连接失败:', err.message);
        rl.close();
        process.exit(1);
      }

      console.log('✅ MySQL 连接成功\n');

      const sqlFile = path.join(__dirname, '..', 'sql', 'init.sql');
      const sql = fs.readFileSync(sqlFile, 'utf8');

      console.log('正在执行 SQL 脚本...\n');

      connection.query(sql, (err, results) => {
        if (err) {
          console.error('❌ SQL 执行失败:', err.message);
          connection.end();
          rl.close();
          process.exit(1);
        }

        console.log('✅ 数据库初始化完成！\n');
        console.log('数据库: library_db');
        console.log('表: book_info, book_type');
        console.log('测试数据: 8 条图书记录，8 种图书类型\n');

        connection.query('SELECT COUNT(*) as count FROM library_db.book_info', (err, results) => {
          if (!err) {
            console.log(`✅ 验证: book_info 表有 ${results[0].count} 条记录`);
          }
          connection.query('SELECT COUNT(*) as count FROM library_db.book_type', (err, results) => {
            if (!err) {
              console.log(`✅ 验证: book_type 表有 ${results[0].count} 条记录`);
            }
            console.log('\n🎉 现在可以运行 npm start 启动应用');
            connection.end();
            rl.close();
            resolve();
          });
        });
      });
    });
  });
}

main().catch(console.error);
