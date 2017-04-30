const express = require('express');
const sha256 = require("crypto-js/sha256");
const marked = require('marked');
const router = express.Router();
const PostModel = require('../models/post');
const CommentModel = require('../models/comment');
const config = require('config-lite')(__dirname);

router.get('/', (req, res) => {
  PostModel.findAll()
  .then(
    function(posts) {
      if(posts.length > 0) {
        posts.forEach((post) => {
          post.content = marked(post.content);
        });
      }

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

      post.content = marked(post.content);

      CommentModel.findAll()
      .then(
        function(comments) {
          res.render('post', {post: post, comments: comments});
        }
      );
    }
  )
  .catch(next);
});

router.post('/:postId', (req, res, next) => {
  const postId = req.params.postId;
  const commentId = (Date.now()).toString();
  const author = req.session.user.username;
  const content = req.fields.comment;
  const website = req.session.website;

  try {
    if(content.trim().length === 0) {
      throw new Error('输入评论不能为空');
    }
  }
  catch(e) {
    req.flash('error', e.message);

    return res.redirect('back');
  };

  const comment = {
    commentId: commentId,
    author: author,
    postId: postId,
    content: content,
    website: website,
  };

  CommentModel.create(comment)
  .then(
    function() {
      req.flash('success', '发表成功');

      res.redirect('back');
    }
  )
  .catch(next);
});

exports = module.exports = router;
