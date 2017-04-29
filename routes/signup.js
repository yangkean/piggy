const express = require('express');
const sha256 = require("crypto-js/sha256"); // 普通加密
const bcrypt = require('bcryptjs'); // 更强大的加密中间件
const config = require('config-lite')(__dirname);
const router = express.Router();
const UserModel = require('../models/user');

// 自动注册网站拥有者账号
UserModel.findOne(config.site.owner)
.then(
  function(result) {
    if(!result) {
      const uid = sha256(config.site.owner).toString();
      const hash = bcrypt.hashSync(config.site.password);

      const user = {
        username: config.site.owner,
        uid: uid,
        website: '',
        email: '',
        password: hash,
      };
      UserModel.create(user)
      .then(() => console.log('Owner account is created...'))
      .catch((err) => console.log(err));
    }
  }
);

router.get('/', (req, res) => {
  res.render('signup');
});

router.post('/', (req, res, next) => {
  const username = req.fields.username;
  const website = req.fields.webiste || '';
  const email = req.fields.email;
  const password = req.fields.password;
  const repassword = req.fields.repassword;

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

  const uid = sha256(username).toString();
  const hash = bcrypt.hashSync(password);

  const user = {
    username: req.fields.username,
    uid: uid,
    website: req.fields.website || '',
    email: req.fields.email,
    password: hash,
  };

  UserModel.create(user)
  .then(
    function(result) {
      const userObj = result.dataValues;

      delete userObj.password;

      req.session.user = userObj;

      req.flash('success', '注册成功');

      res.redirect('/posts');
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
