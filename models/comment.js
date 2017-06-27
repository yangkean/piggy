const Comment = require('./db').Comment;
const Post = require('./db').Post;
const PostModel = require('./post');

Comment.hook('afterCreate', function(comment, options) {
  PostModel.findOne(comment.postId)
  .then(
    function(post) {
      Post.update({
        commentsCount: post.commentsCount + 1,
      }, {
        where: {
          postId: comment.postId,
        },
      })
      .then(() => {
        // console.log('\x1b[34m%s\x1b[0m', 'commentsCount is updated...')
      });
    }
  );
});

exports = module.exports = {
  create(comment) {
    return Comment.sync()
            .then(
              function() {
                return Comment.create(comment);
              }
            );
  },

  findAll(postId) {
    return Comment.sync()
            .then(
              function() {
                return Comment.findAll({
                  where: {
                    postId: postId,
                  },
                  order: [['commentId', 'DESC']],
                });
              }
            );
  },

  findOne(commentId) {
    return Comment.sync()
            .then(
              function() {
                return Comment.findOne({
                  where: {
                    commentId: commentId,
                  },
                });
              }
            );
  },

  delete(postId) {
    return Comment.sync()
            .then(
              function() {
                return Comment.destroy({
                  where: {
                    postId: postId,
                  },
                });
              }
            );
  }
};
