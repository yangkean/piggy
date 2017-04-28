const express = require('express');
const bcrypt = require('bcryptjs'); // 用于密码加密的中间件
const router = express.Router();
const UserModel = require('../models/user');

router.get('/', (req, res) => {
  res.render('signup');
});

router.post('/', (req, res, next) => {
  let username = req.fields.username;
  let website = req.fields.webiste || '';
  let email = req.fields.email;
  let password = req.fields.password;
  let repassword = req.fields.repassword;

  try {
    if(username.length < 3 || username.length >10) {
      throw new Error('用户名请限制在 3-10 个字符');
    }

    if(password.length < 6) {
      throw new Error('密码至少 6 个字符');
    }

    if(password !== repassword) {
      throw new Error('两次输入密码不一致');
    }
  }
  catch(e) {
    req.flash('error', e.message);

    return res.redirect('/signup');
  }

  const hash = bcrypt.hashSync(password);

  let user = {
    username: req.fields.username,
    website: req.fields.website || '',
    email: req.fields.email,
    password: hash,
  };

  UserModel.create(user)
  .then(
    function(result) {
      let userObj = result.dataValues;

      delete userObj.password;

      req.session.user = userObj;

      req.flash('success', '注册成功');

      res.redirect('/home');
    }
  )
  .catch(
    function(err) {
      if(err.message.match('Validation error')) {
        req.flash('error', '用户名已被占用');

        return res.redirect('/signup');
      }

      next(err);
    }
  );
});

exports = module.exports = router;
