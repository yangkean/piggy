const User = require('./db').User;

exports = module.exports = {
  // 创建用户
  create(user) {
    // 将定义的模型同步到数据库
    return User.sync()
            .then(
              function() {
              // 创建用户信息表
              return User.create(user);
            });
  },

  // 查询用户
  findOne(username) {
    return User.findOne({
      where: {
        username: username,
      },
    });
  },
};
