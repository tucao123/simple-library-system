const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const path = require('path');
const { formatDate, formatShortDate } = require('./helpers/dateHelper');

const bookRoutes = require('./routes/books');
const typeRoutes = require('./routes/types');

const app = express();
const PORT = process.env.PORT || 3000;

// 视图引擎
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// 注册 EJS 辅助函数
app.locals.formatDate = formatDate;
app.locals.formatShortDate = formatShortDate;

// 中间件
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// 路由
app.use('/books', bookRoutes);
app.use('/types', typeRoutes);

// 默认重定向到图书列表
app.get('/', (req, res) => {
  res.redirect('/books');
});

// 全局错误处理
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('error', { message: '服务器内部错误' });
});

app.listen(PORT, () => {
  console.log(`图书管理系统运行在 http://localhost:${PORT}`);
});

module.exports = app;
