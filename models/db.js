const Sequelize = require('sequelize'); // 引入 MySQL 的 ORM 库 Sequelize
const config = require('config-lite')(__dirname);
const sequelize = new Sequelize(config.mysql.database, config.mysql.username, config.mysql.password, {
  host: config.mysql.host,
  dialect: config.mysql.dialect, // 指定数据库类型
  pool: {
    max: config.mysql.pool.max, // 数据库连接池的最大连接数
    min: config.mysql.pool.min,
    idle: config.mysql.pool.idle, // 连接被释放前的最大空闲时间 (ms)
  },
  timezone: config.mysql.timezone, // 时区
  dialectOptions: { // 这里的选项将直接传给连接库
    charset: config.mysql.charset,
  },
});

// 定义用户信息模型
const User = sequelize.define('user', {
  username: {
    type: Sequelize.STRING,
    primaryKey: true,
  },
  uid: {type: Sequelize.STRING},
  website: {type: Sequelize.STRING},
  email: {type: Sequelize.STRING},
  password: {type: Sequelize.STRING},
}, {
  freezeTableName: true, // 数据库中模型表名和此处模型名一样，否则为复数形式
});

// 定义博客信息
const Post = sequelize.define('post', {
  title: {
    type: Sequelize.STRING,
    primaryKey: true,
  },
  postId: {type: Sequelize.STRING},
  content: {type: Sequelize.TEXT},
  pv: {type: Sequelize.DECIMAL},
  commentsCount: {type: Sequelize.DECIMAL},
}, {
  freezeTableName: true,
});

// 定义评论信息
const Comment = sequelize.define('comment', {
  commentId: {
    type: Sequelize.STRING,
    primaryKey: true,
  },
  author: {type: Sequelize.STRING},
  website: {type: Sequelize.STRING},
  postId: {type: Sequelize.STRING},
  content: {type: Sequelize.STRING},
}, {
  freezeTableName: true,
});

exports.dbConnection = sequelize;
exports.User = User;
exports.Post = Post;
exports.Comment = Comment;
