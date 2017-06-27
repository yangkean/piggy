const express = require('express');
const sha256 = require("crypto-js/sha256");
const marked = require('marked');
const html = require('html-escaper');
const router = express.Router();
const PostModel = require('../models/post');
const InfoModel = require('../models/info');
const CommentModel = require('../models/comment');
const config = require('config-lite')(__dirname);
const pagination = require('../middleware/pagination');

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

const limit = 5; // 每页限制文章数

router.get('/', (req, res, next) => {
  let index = Number.parseInt(req.query.page) || 1;

  PostModel.count()
  .then(
    function(totalItem) {
      const total = Math.ceil(totalItem / limit); // 存储总页数

      if(index > total) index = total;
      if(index < 1) index = 1;

      const offset = limit * (index - 1);
      const paginationElements = pagination(index, total);

      PostModel.findAll({offset, limit})
      .then(
        function(posts) {
          if(posts.length > 0) {
            posts.forEach((post) => {
              post.content = marked(post.content);
            });
          }

          res.render('blogs', {posts: posts, total: total, pagination: paginationElements});
        }
      )
      .catch(next);
    }
  );
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
    const title = html.escape(req.fields.title.trim());
    const tag = req.fields.tag.trim();
    const postId = sha256(title).toString();
    const content = html.escape(req.fields.content.trim());
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

    const info = {
      name: 'tags',
      content: '',
    };

    PostModel.create(post)
    .then(
      function() {
        InfoModel.findOne(info.name)
        .then(
          function(item) {
            if(!item) {
              info.content = tag;

              InfoModel.create(info);

              return;
            }

            const contentSet = new Set(item.content && item.content.split(' '));

            for(newTag of tag.split(' ')) {
              contentSet.add(newTag);
            }

            info.content = Array.from(contentSet).join(' ');
            InfoModel.update(info);
          }
        );
      }
    )
    .then(
      function() {
        req.flash('success', '发布成功');

        res.redirect('/posts');
      }
    )
    .catch(next);
  }
  else {
    res.send('You have no permission to do this!');
  }
});

router.get('/tags/:tag?', (req, res, next) => {
  const tag = req.params.tag ? req.params.tag.trim() : '';

  PostModel.findAll({tag, limit: 50})
  .then(
    function(posts) {
      if(posts.length > 0) {
        posts.forEach((post) => {
          post.content = marked(post.content);
        });
      }

      res.render('blogs', {posts: posts, pagination: ''});
    }
  )
  .catch(next);
});

router.get('/:postId', (req, res, next) => {
  const user = req.session.user;
  const postId = req.params.postId;

  PostModel.findOne(postId)
  .then(
    function(post) {
      if(!post) {
        return res.send('404 Not Found');
      }

      res.locals.postId = postId;
      post.content = marked(post.content);

      CommentModel.findAll(postId)
      .then(
        function(comments) {
          InfoModel.findOne('tags')
          .then(
            function(tags) {
              res.render('post', {post: post, comments: comments, tags: tags.content.split(' '), user: user});
            }
          );
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
        post.title = html.unescape(post.title);
        post.content = html.unescape(post.content);

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
    const title = html.escape(req.fields.title.trim());
    const content = html.escape(req.fields.content.trim());
    const tag = req.fields.tag.trim();
    const postId = req.params.postId;

    const updatePost = {
      title,
      postId,
      content,
      tag,
    };

    const info = {
      name: 'tags',
      content: '',
    };

    PostModel.update(updatePost)
    .then(
      function() {
        InfoModel.findOne(info.name)
        .then(
          function(item) {
            const contentSet = new Set(item.content && item.content.split(' '));

            for(newTag of tag.split(' ')) {
              contentSet.add(newTag);
            }

            info.content = Array.from(contentSet).join(' ');
            InfoModel.update(info);
          }
        );
      }
    )
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
  if(!req.session.user) {
    return res.send('You have no permission to do this!');
  }

  const postId = req.params.postId;
  const commentId = (Date.now()).toString();
  const author = req.session.user.username;
  const content = html.escape(req.fields.comment.trim());
  const website = req.session.user.website;
  const repliedCommentId = req.params.repliedCommentId; // 被回复者的 commentId

  try {
    if(content.length === 0) {
      throw new Error('输入评论不能为空');
    }
  }
  catch(e) {
    req.flash('error', e.message);

    return res.redirect(`/posts/${postId}`);
  };

  const comment = {
    commentId,
    author,
    postId,
    content,
    website,
  };

  if(repliedCommentId) {
    // 回复他人评论
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
                );
              }
            )
            .catch(next);
  }

  comment.content = marked(comment.content);
  CommentModel.create(comment)
  .then(
    function() {
      req.flash('success', '发表成功');

      res.redirect(`/posts/${postId}`);
    }
  )
  .catch(next);
});

exports = module.exports = router;
