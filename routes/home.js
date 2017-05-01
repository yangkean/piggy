const express = require('express');
const marked = require('marked');
const router = express.Router();
const config = require('config-lite')(__dirname);
const HomeModel = require('../models/home');

router.get('/', (req, res, next) => {
  const owner = config.site.owner;

  HomeModel.get(owner)
  .then(
    function(home) {
      if(home) {
        home.introduction = marked(home.introduction);
      }

      res.render('home', {home: home});
    }
  )
  .catch(next);
});

router.get('/editing', (req, res, next) => {
  const user = req.session.user;
  const owner = config.site.owner;

  if(user && user.username === config.site.owner) {
    HomeModel.get(owner)
    .then(
      function(home) {
        res.render('home-editing', {home: home});
      }
    )
    .catch(next);
  }
  else {
    res.send('404 Not Found');
  }
});

router.post('/editing', (req, res, next) => {
  const owner = config.site.owner;
  const introduction = req.fields.introduction;
  const email = req.fields.email || '';
  const github = req.fields.github || '';
  const weibo = req.fields.weibo || '';
  const twitter = req.fields.twitter || '';

  const home = {
    owner,
    introduction,
    email,
    github,
    weibo,
    twitter,
  };

  HomeModel.edit(home)
  .then(
    function() {
      req.flash('success', '编辑成功');

      res.redirect('/home');
    }
  )
  .catch(next);
});

exports = module.exports = router;
