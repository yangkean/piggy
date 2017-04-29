const Post = require('./db').Post;

exports = module.exports = {
  // 新建文章
  create(post) {
    return Post.sync()
            .then(
              function() {
                return Post.create(post);
              }
            );
  },

  // 查找一篇文章
  findOne(postId) {
    return Post.findOne({
      where: {
        postId: postId,
      },
    });
  },

  // 查找全部文章
  // @return {Array} an array of all instances
  findAll() {
    return Post.findAll();
  },
};
