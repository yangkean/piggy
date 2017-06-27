const express = require('express');
const marked = require('marked');
const html = require('html-escaper');
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

  if(user && user.username === owner) {
    HomeModel.get(owner)
    .then(
      function(home) {

        home.introduction = html.unescape(home.introduction);
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
  const introduction = html.escape(req.fields.introduction.trim());
  const email = req.fields.email.trim();
  const github = req.fields.github.trim();
  const weibo = req.fields.weibo.trim();
  const twitter = req.fields.twitter.trim();
  const user = req.session.user;

  const home = {
    owner,
    introduction,
    email,
    github,
    weibo,
    twitter,
  };

  if(user && user.username === owner) {
    HomeModel.edit(home)
    .then(
      function() {
        req.flash('success', '编辑成功');

        res.redirect('/home');
      }
    )
    .catch(next);
  }
  else {
    res.send('You have no permission to do this!');
  }
});

exports = module.exports = router;
