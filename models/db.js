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
  logging: false, // 禁止打印 SQL 语句
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
  tag: {type: Sequelize.STRING},
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

// 定义首页信息
const Home = sequelize.define('home', {
  owner: {
    type: Sequelize.STRING,
    primaryKey: true,
  },
  introduction: {type: Sequelize.TEXT},
  email: {type: Sequelize.STRING},
  github: {type: Sequelize.STRING},
  weibo: {type: Sequelize.STRING},
  twitter: {type: Sequelize.STRING},
}, {
  freezeTableName: true,
});

// 定义杂碎的信息条目
const Info = sequelize.define('info', {
  name: {
    type: Sequelize.STRING,
    primaryKey: true,
  },
  content: {type: Sequelize.STRING},
}, {
  freezeTableName: true,
});

exports = module.exports = {
  dbConnection: sequelize,
  User,
  Post,
  Comment,
  Home,
  Info,
};
