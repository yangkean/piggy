const Post = require('./db').Post;

Post.hook('afterFind', function(post, options) {
  // 用户查看一篇博客时增加其 pv
  if(!Array.isArray(post) && post.postId) {
    Post.update({
      pv: post.pv + 1,
    }, {
      where: {
        postId: post.postId,
      },
    })
    .then(() => console.log('\x1b[34m%s\x1b[0m', 'pv is updated...'));
  }
});

exports = module.exports = {
  create(post) {
    return Post.sync()
            .then(
              function() {
                return Post.create(post);
              }
            );
  },

  update(updatedPost) {
    return Post.sync()
            .then(
              function() {
                return Post.update({
                  title: updatedPost.title,
                  content: updatedPost.content,
                  tag: updatedPost.tag,
                }, {
                  where: {
                    postId: updatedPost.postId,
                  },
                });
              }
            );
  },

  findOne(postId) {
    return Post.sync()
            .then(
              function() {
                return Post.findOne({
                  where: {
                    postId: postId,
                  },
                });
              }
            );
  },

  // @return {Array} an array of all instances
  findAll() {
    return Post.sync()
            .then(
              function() {
                return Post.findAll({
                  order: [['createdAt', 'DESC']],
                });
              }
            );
  },
};
