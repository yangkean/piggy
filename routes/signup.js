const express = require('express');
const router = express.Router();
const UserModel = require('../models/user');

router.get('/', (req, res) => {
  res.render('signup');
});

router.post('/', (req, res) => {
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
    // todo notification
    res.send(e.message);
  }

  let user = {
    username: req.fields.username,
    website: req.fields.website || '',
    email: req.fields.email,
    password: req.fields.password,
  };

  UserModel.create(user)
  .then(
    function() {
      console.log('success');
    }
  );
});

exports = module.exports = router;
