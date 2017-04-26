const User = require('./db').User;

exports = module.exports = {
  // 创建用户
  create(user) {
    // 将定义的模型同步到数据库
    User.sync()
    .then(
      function() {
      // 创建用户信息表
      return User.create(user);
    });
  },
};
