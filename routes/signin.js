const express = require('express');
const bcrypt = require('bcryptjs'); // 用于密码加密的中间件
const UserModel = require('../models/user');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('signin');
});

router.post('/', (req, res, next) => {
  let username = req.fields.username;
  let password = req.fields.password;

  UserModel.findOne(username)
  .then(
    function(result) {
      if(!result) {
        req.flash('error', '用户名或密码不正确'); // 实际为用户名不正确

        return res.redirect('/signin');
      }

      let userObj = result.dataValues;
      let isCorrect = bcrypt.compareSync(password, userObj.password);

      if(isCorrect) {
        delete userObj.password;

        req.session.user = userObj;

        req.flash('success', '登录成功');

        res.redirect('/home');
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
