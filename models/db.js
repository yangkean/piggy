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
});

// 定义用户信息模型
const User = sequelize.define('user', {
  username: {
    type: Sequelize.STRING,
    unique: true,
    primaryKey: true,
  },
  website: {type: Sequelize.STRING},
  email: {type: Sequelize.STRING},
  password: {type: Sequelize.STRING},
}, {
  freezeTableName: true, // 模型表名和模型名一样，否则为复数形式
});

exports.dbConnection = sequelize;
exports.User = User;
