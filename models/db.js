const Sequelize = require('sequelize'); // 引入 MySQL 的 ORM 库 Sequelize

const sequelize = new Sequelize('CMS', 'root', '123456', {
  host: 'localhost',
  dialect: 'mysql', // 指定数据库类型

  pool: {
    max: 6, // 数据库连接池的最大连接数
    min: 0,
    idle: 12000, // 连接被释放前的最大空闲时间 (ms)
  },
});

// 定义用户信息模型
const User = sequelize.define('user', {
  username: {type: Sequelize.STRING},
  website: {type: Sequelize.STRING},
  email: {type: Sequelize.STRING},
  password: {type: Sequelize.STRING},
}, {
  freezeTableName: true, // 模型表名和模型名一样，否则为复数形式
});

exports.User = User;
