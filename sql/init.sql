-- =============================================
-- 图书借阅系统后台管理 - 数据库初始化脚本
-- 数据库: library_db
-- 包含: 创建表结构、主键、测试数据
-- =============================================

-- 创建数据库
CREATE DATABASE IF NOT EXISTS library_db 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_general_ci;

USE library_db;

-- =============================================
-- 图书类型表 book_type
-- =============================================
CREATE TABLE IF NOT EXISTS book_type (
  id INT AUTO_INCREMENT PRIMARY KEY,
  typeName VARCHAR(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =============================================
-- 图书信息表 book_info
-- =============================================
CREATE TABLE IF NOT EXISTS book_info (
  bookId INT AUTO_INCREMENT PRIMARY KEY COMMENT '图书 ID（自动增长）',
  bookCode VARCHAR(50) NOT NULL COMMENT '图书编号',
  bookName VARCHAR(100) NOT NULL COMMENT '图书名称',
  bookType INT NOT NULL COMMENT '图书类型（外键关联 book_type.id）',
  bookAuthor VARCHAR(100) NOT NULL COMMENT '作者',
  publishPress VARCHAR(100) NOT NULL COMMENT '出版社',
  publishDate DATE NOT NULL COMMENT '出版日期',
  borrowed INT NOT NULL DEFAULT 0 COMMENT '是否借阅（1=已借阅, 0=未借阅）',
  createdBy VARCHAR(50) NOT NULL COMMENT '入库人',
  creationTime DATETIME NOT NULL COMMENT '入库时间',
  lastUpdatetime DATETIME NULL COMMENT '最新更新时间',
  
  -- 外键约束
  FOREIGN KEY (bookType) REFERENCES book_type(id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='图书信息表';

-- =============================================
-- 插入图书类型数据（8种类型）
-- =============================================
INSERT INTO book_type (typeName) VALUES
('小说'),
('文学'),
('传记'),
('艺术'),
('少儿'),
('经济'),
('管理'),
('科技');

-- =============================================
-- 插入测试数据（至少 5 条，这里插入 8 条）
-- =============================================
INSERT INTO book_info 
  (bookCode, bookName, bookType, bookAuthor, publishPress, publishDate, borrowed, createdBy, creationTime, lastUpdatetime) 
VALUES
  ('BK001', 'Java核心技术 卷I', 8, 'Cay S. Horstmann', '机械工业出版社', '2016-05-01', 0, 'admin', NOW(), NULL),
  ('BK002', '百年孤独', 1, '加西亚·马尔克斯', '南海出版公司', '2011-06-01', 1, 'admin', NOW(), NULL),
  ('BK003', '活着', 2, '余华', '作家出版社', '2012-08-01', 0, 'admin', NOW(), NULL),
  ('BK004', '史蒂夫·乔布斯传', 3, '沃尔特·艾萨克森', '中信出版社', '2011-10-01', 0, 'admin', NOW(), NULL),
  ('BK005', '小王子', 5, '安托万·德·圣埃克苏佩里', '人民文学出版社', '2003-08-01', 1, 'admin', NOW(), NULL),
  ('BK006', '经济学原理', 6, '曼昆', '北京大学出版社', '2015-05-01', 0, 'admin', NOW(), NULL),
  ('BK007', '艺术的故事', 4, '贡布里希', '广西美术出版社', '2008-04-01', 0, 'admin', NOW(), NULL),
  ('BK008', '从0到1', 7, '彼得·蒂尔', '中信出版社', '2015-01-01', 0, 'admin', NOW(), NULL);

-- =============================================
-- 验证数据
-- =============================================
SELECT '图书类型表数据：' AS info;
SELECT * FROM book_type;

SELECT '图书信息表数据：' AS info;
SELECT bookId, bookCode, bookName, typeName, bookAuthor, borrowed, createdBy, DATE_FORMAT(creationTime, '%Y-%m-%d') AS creationTime 
FROM book_info b
LEFT JOIN book_type t ON b.bookType = t.id
ORDER BY b.creationTime DESC;
