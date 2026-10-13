# simple-library-system

基于 Express + MySQL 的图书借阅系统后台管理应用。

## 功能特性

- ✅ 图书列表（分页显示，每页5条，隔行变色）
- ✅ 模糊查询（按图书名称搜索，记忆查询条件）
- ✅ 查看详情（只读展示所有字段）
- ✅ 新增图书（表单验证，默认值）
- ✅ 修改图书（入库人和入库时间只读）
- ✅ 删除图书（确认提示，操作反馈）

## 技术栈

| 层次 | 技术 |
|------|------|
| 后端框架 | Node.js + Express |
| 数据库 | MySQL 5+ |
| 页面模板 | EJS + jQuery 1.8.3 |
| 样式 | 自定义 CSS（类 Pixso 设计风格） |
| 版本管理 | Git + GitHub |

## 快速开始

### 环境要求
- Node.js >= 14
- MySQL >= 5.0

### 安装步骤

1. 克隆仓库
```bash
git clone https://github.com/tucao123/simple-library-system.git
cd simple-library-system
```

2. 安装依赖
```bash
npm install
```

3. 配置数据库连接
```bash
# 复制 .env.example 为 .env 并填入你的 MySQL 配置
cp .env.example .env
```

编辑 `.env` 文件：
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=你的MySQL密码
DB_NAME=library_db
```

4. 初始化数据库
```bash
npm run db:init
# 或运行交互式脚本（支持自定义密码）
node scripts/init-db.js
```

5. 启动应用
```bash
npm start
# 访问 http://localhost:3000
```

## 项目结构

```
simple-library-system/
├── app.js              # Express 主入口
├── package.json        # 项目依赖
├── config/db.js        # MySQL 连接池配置
├── dao/                # 数据访问层
├── routes/             # 路由控制器
├── views/              # EJS 页面模板
├── public/css/         # 全局样式
├── helpers/            # 辅助函数
└── sql/init.sql        # 数据库初始化脚本
```

## License

MIT
