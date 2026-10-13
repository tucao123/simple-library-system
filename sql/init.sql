-- 创建数据库
CREATE DATABASE IF NOT EXISTS library_db CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE library_db;

-- 图书类型表
CREATE TABLE IF NOT EXISTS book_type (
  id INT AUTO_INCREMENT PRIMARY KEY,
  typeName VARCHAR(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 图书信息表
CREATE TABLE IF NOT EXISTS book_info (
  bookId INT AUTO_INCREMENT PRIMARY KEY,
  bookCode VARCHAR(50) NOT NULL,
  bookName VARCHAR(100) NOT NULL,
  bookType INT NOT NULL,
  bookAuthor VARCHAR(100) NOT NULL,
  publishPress VARCHAR(100) NOT NULL,
  publishDate DATE NOT NULL,
  borrowed INT NOT NULL DEFAULT 0 COMMENT '1=已借阅, 0=未借阅',
  createdBy VARCHAR(50) NOT NULL,
  creationTime DATETIME NOT NULL,
  lastUpdatetime DATETIME NULL,
  FOREIGN KEY (bookType) REFERENCES book_type(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 插入图书类型数据（8种）
INSERT INTO book_type (typeName) VALUES
('小说'),
('文学'),
('传记'),
('艺术'),
('少儿'),
('经济'),
('管理'),
('科技');

-- 插入测试数据（至少5条）
INSERT INTO book_info (bookCode, bookName, bookType, bookAuthor, publishPress, publishDate, borrowed, createdBy, creationTime, lastUpdatetime) VALUES
('BK001', 'Java核心技术', 8, 'Cay S. Horstmann', '机械工业出版社', '2016-05-01', 0, 'admin', NOW(), NULL),
('BK002', '百年孤独', 1, '加西亚·马尔克斯', '南海出版公司', '2011-06-01', 1, 'admin', NOW(), NULL),
('BK003', '活着', 2, '余华', '作家出版社', '2012-08-01', 0, 'admin', NOW(), NULL),
('BK004', '史蒂夫·乔布斯传', 3, '沃尔特·艾萨克森', '中信出版社', '2011-10-01', 0, 'admin', NOW(), NULL),
('BK005', '小王子', 5, '安托万·德·圣埃克苏佩里', '人民文学出版社', '2003-08-01', 1, 'admin', NOW(), NULL),
('BK006', '经济学原理', 6, '曼昆', '北京大学出版社', '2015-05-01', 0, 'admin', NOW(), NULL),
('BK007', '艺术的故事', 4, '贡布里希', '广西美术出版社', '2008-04-01', 0, 'admin', NOW(), NULL),
('BK008', '从0到1', 7, '彼得·蒂尔', '中信出版社', '2015-01-01', 0, 'admin', NOW(), NULL);
