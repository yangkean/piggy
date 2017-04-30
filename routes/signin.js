const express = require('express');
const bcrypt = require('bcryptjs'); // 用于密码加密的中间件
const UserModel = require('../models/user');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('signin');
});

router.post('/', (req, res, next) => {
  const username = req.fields.username;
  const password = req.fields.password;

  UserModel.findOne(username)
  .then(
    function(user) {
      if(!user) {
        req.flash('error', '用户名或密码不正确'); // 实际为用户名不正确

        return res.redirect('/signin');
      }

      const isCorrect = bcrypt.compareSync(password, user.password);

      if(isCorrect) {
        delete user.password;

        req.session.user = user;

        req.flash('success', '登录成功');

        res.redirect('/posts');
      }
      else {
        req.flash('error', '用户名或密码不正确');

        res.redirect('/signin');
      }
    }
  )
  .catch(next);
});

exports = module.exports = router;
