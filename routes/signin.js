const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('signin');
});

router.post('/', (req, res) => {
  res.send('hello piggy!');
});

exports = module.exports = router;
