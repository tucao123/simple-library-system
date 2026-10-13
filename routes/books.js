const express = require('express');
const router = express.Router();
const bookDAO = require('../dao/bookDAO');
const typeDAO = require('../dao/typeDAO');

// 图书列表（支持分页和模糊搜索）
router.get('/', async (req, res) => {
  try {
    const search = req.query.search || '';
    const page = parseInt(req.query.page) || 1;
    
    const result = await bookDAO.findAll(search, page);
    const types = await typeDAO.findAll();
    
    res.render('book-list', {
      books: result.books,
      types,
      search,
      page: result.page,
      totalPages: result.totalPages,
      total: result.total,
      message: req.query.message,
      messageType: req.query.type
    });
  } catch (err) {
    res.status(500).render('error', { message: '获取图书列表失败' });
  }
});

// 查看图书详情
router.get('/detail/:id', async (req, res) => {
  try {
    const book = await bookDAO.findById(req.params.id);
    if (!book) {
      return res.redirect('/books?message=图书不存在&type=error');
    }
    res.render('book-detail', { book });
  } catch (err) {
    res.status(500).render('error', { message: '获取图书详情失败' });
  }
});

// 新增图书页面
router.get('/add', async (req, res) => {
  try {
    const types = await typeDAO.findAll();
    res.render('book-add', { types });
  } catch (err) {
    res.status(500).render('error', { message: '加载新增页面失败' });
  }
});

// 处理新增图书
router.post('/add', async (req, res) => {
  try {
    const { bookCode, bookName, bookType, bookAuthor, publishPress, publishDate, borrowed } = req.body;
    
    await bookDAO.create({
      bookCode,
      bookName,
      bookType: parseInt(bookType),
      bookAuthor,
      publishPress,
      publishDate,
      borrowed: parseInt(borrowed) || 0,
      createdBy: 'admin'
    });
    
    res.redirect('/books?message=图书添加成功&type=success');
  } catch (err) {
    res.redirect('/books/add?message=图书添加失败&type=error');
  }
});

// 修改图书页面
router.get('/edit/:id', async (req, res) => {
  try {
    const book = await bookDAO.findById(req.params.id);
    if (!book) {
      return res.redirect('/books?message=图书不存在&type=error');
    }
    const types = await typeDAO.findAll();
    res.render('book-edit', { book, types });
  } catch (err) {
    res.status(500).render('error', { message: '加载修改页面失败' });
  }
});

// 处理修改图书
router.post('/edit/:id', async (req, res) => {
  try {
    const { bookCode, bookName, bookType, bookAuthor, publishPress, publishDate, borrowed } = req.body;
    
    const success = await bookDAO.update(req.params.id, {
      bookCode,
      bookName,
      bookType: parseInt(bookType),
      bookAuthor,
      publishPress,
      publishDate,
      borrowed: parseInt(borrowed)
    });
    
    if (success) {
      res.redirect('/books?message=图书修改成功&type=success');
    } else {
      res.redirect('/books?message=图书修改失败&type=error');
    }
  } catch (err) {
    res.redirect(`/books/edit/${req.params.id}?message=图书修改失败&type=error`);
  }
});

// 删除图书
router.post('/delete/:id', async (req, res) => {
  try {
    const success = await bookDAO.delete(req.params.id);
    
    if (success) {
      res.redirect('/books?message=删除成功&type=success');
    } else {
      res.redirect('/books?message=删除失败&type=error');
    }
  } catch (err) {
    res.redirect('/books?message=删除失败&type=error');
  }
});

module.exports = router;
