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

  findAll() {
    return Comment.sync()
            .then(
              function() {
                return Comment.findAll();
              }
            );
  },
};
