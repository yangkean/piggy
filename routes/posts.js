const express = require('express');
const sha256 = require("crypto-js/sha256");
const router = express.Router();
const PostModel = require('../models/post');
const config = require('config-lite')(__dirname);

router.get('/', (req, res) => {
  PostModel.findAll()
  .then(
    function(posts) {
      res.render('blogs', {posts: posts});
    }
  )
});

router.get('/creation', (req, res) => {
  const user = req.session.user;

  if(user && user.username === config.site.owner) {
    res.render('creation');
  }
  else {
    res.send('404 Not Found');
  }
});

router.post('/creation', (req, res, next) => {
  const user = req.session.user;

  if(user && user.username === config.site.owner) {
    const title = req.fields.title;
    const postId = sha256(title).toString();
    const content = req.fields.content;
    const pv = 0;
    const commentsCount = 0;

    const post = {
      title: title,
      postId: postId,
      content: content,
      pv: pv,
      commentsCount: commentsCount,
    };

    PostModel.create(post)
    .then(
      function() {
        req.flash('success', '发布成功');

        res.redirect('/posts');
      }
    )
    .catch(next);
  }
});

router.get('/:postId', (req, res, next) => {
  const postId = req.params.postId;

  PostModel.findOne(postId)
  .then(
    function(post) {
      if(!post) {
        req.flash('error', '文章不存在');

        return res.redirect('/posts');
      }

      res.render('post', {post: post});
    }
  )
  .catch(next);
});

exports = module.exports = router;
