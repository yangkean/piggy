const Comment = require('./db').Comment;

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
};
