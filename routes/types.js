const express = require('express');
const router = express.Router();
const typeDAO = require('../dao/typeDAO');

// 图书类型管理页面
router.get('/', async (req, res) => {
  try {
    const types = await typeDAO.findAllWithCount();
    res.render('type-list', {
      types,
      message: req.query.message || '',
      messageType: req.query.type || ''
    });
  } catch (err) {
    console.error(err);
    res.status(500).render('error', { message: '获取图书类型失败' });
  }
});

// JSON API（供前端下拉框等异步调用使用）
router.get('/api', async (req, res) => {
  try {
    const types = await typeDAO.findAll();
    res.json(types);
  } catch (err) {
    res.status(500).json({ error: '获取图书类型失败' });
  }
});

// 新增图书类型
router.post('/', async (req, res) => {
  try {
    const typeName = (req.body.typeName || '').trim();
    if (!typeName) {
      return res.redirect('/types?message=类型名称不能为空&type=error');
    }
    const existing = await typeDAO.findAll();
    if (existing.some(t => t.typeName === typeName)) {
      return res.redirect('/types?message=该类型名称已存在&type=error');
    }
    await typeDAO.create(typeName);
    res.redirect('/types?message=类型添加成功&type=success');
  } catch (err) {
    console.error(err);
    res.redirect('/types?message=类型添加失败&type=error');
  }
});

// 修改图书类型
router.post('/:id', async (req, res) => {
  try {
    const typeName = (req.body.typeName || '').trim();
    if (!typeName) {
      return res.redirect('/types?message=类型名称不能为空&type=error');
    }
    const existing = await typeDAO.findAll();
    const duplicate = existing.some(t => t.typeName === typeName && String(t.id) !== String(req.params.id));
    if (duplicate) {
      return res.redirect('/types?message=该类型名称已存在&type=error');
    }
    const ok = await typeDAO.update(req.params.id, typeName);
    res.redirect(ok ? '/types?message=类型修改成功&type=success' : '/types?message=类型修改失败&type=error');
  } catch (err) {
    console.error(err);
    res.redirect('/types?message=类型修改失败&type=error');
  }
});

// 删除图书类型（外键 ON DELETE RESTRICT，先检查是否被引用）
router.post('/:id/delete', async (req, res) => {
  try {
    const bookCount = await typeDAO.countBooks(req.params.id);
    if (bookCount > 0) {
      return res.redirect(`/types?message=该类型下有 ${bookCount} 本图书，无法删除&type=error`);
    }
    const ok = await typeDAO.delete(req.params.id);
    res.redirect(ok ? '/types?message=删除成功&type=success' : '/types?message=删除失败&type=error');
  } catch (err) {
    console.error(err);
    res.redirect('/types?message=删除失败&type=error');
  }
});

module.exports = router;
