const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
  // 清空用户信息
  req.session.user = null;

  res.redirect('/home');
});

exports = module.exports = router;
