const express = require('express');
const sha256 = require("crypto-js/sha256");
const marked = require('marked');
const router = express.Router();
const PostModel = require('../models/post');
const CommentModel = require('../models/comment');
const config = require('config-lite')(__dirname);

// 增加 `TODO lists` 功能
const renderer = new marked.Renderer();
renderer.listitem = function(text) {
  if (/^\s*\[[x ]\]\s*/.test(text)) {
    text = text
            .replace(/^\s*\[ \]\s*/, '<i class="square outline icon"></i> ')
            .replace(/^\s*\[x\]\s*/, '<i class="checkmark box icon"></i> ');
            return '<li style="list-style: none;">' + text + '</li>';
  }
  else {
    return '<li>' + text + '</li>';
  }
};
marked.setOptions({
  renderer: renderer,
});

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
    const tag = req.fields.tag.trim();
    const postId = sha256(title).toString();
    const content = req.fields.content;
    const pv = 0;
    const commentsCount = 0;

    const post = {
      title,
      tag,
      postId,
      content,
      pv,
      commentsCount,
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

      res.locals.postId = postId;
      post.content = marked(post.content);

      CommentModel.findAll(postId)
      .then(
        function(comments) {
          res.render('post', {post: post, comments: comments});
        }
      );
    }
  )
  .catch(next);
});

router.get('/:postId/editing', (req, res, next) => {
  const user = req.session.user;
  const owner = config.site.owner;
  const postId = req.params.postId;

  if(user && user.username === owner) {
    PostModel.findOne(postId)
    .then(
      function(post) {
        res.render('post-editing', {post: post});
      }
    )
    .catch(next);
  }
  else {
    res.send('404 Not Found');
  }
});

router.post('/:postId/editing', (req, res, next) => {
  const user = req.session.user;
  const owner = config.site.owner;

  if(user && user.username === owner) {
    const title = req.fields.title;
    const content = req.fields.content;
    const tag = req.fields.tag;
    const postId = req.params.postId;

    const updatePost = {
      title,
      postId,
      content,
      tag,
    };

    PostModel.update(updatePost)
    .then(
      function() {
        req.flash('success', '编辑成功');

        res.redirect(`/posts/${postId}`);
      }
    )
    .catch(next);
  }
});

router.post('/:postId/:repliedCommentId?', (req, res, next) => {
  const postId = req.params.postId;
  const commentId = (Date.now()).toString();
  const author = req.session.user.username;
  const content = req.fields.comment;
  const website = req.session.user.website;
  const repliedCommentId = req.params.repliedCommentId; // 被回复者的 commentId

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
    commentId,
    author,
    postId,
    content,
    website,
  };

  if(repliedCommentId) {
    return CommentModel.findOne(repliedCommentId)
            .then(
              function(repliedComment) {
                comment.content = `<pre class="piggy-reply-box">${repliedComment.content}</pre>@${repliedComment.author}，${comment.content}`;

                comment.content = marked(comment.content);

                CommentModel.create(comment)
                .then(
                  function() {
                    req.flash('success', '回复成功');

                    res.redirect(`/posts/${postId}`);
                  }
                )
                .catch(next);
              }
            )
            .catch(next);
  }

  comment.content = marked(comment.content);
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
