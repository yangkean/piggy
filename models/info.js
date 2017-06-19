const Info = require('./db').Info;

exports = module.exports = {
  create(item) {
    return Info.sync()
            .then(
              function() {
                return Info.create(item);
              }
            );
  },

  update(updatedItem) {
    return Info.sync()
            .then(
              function() {
                return Info.update({
                  content: updatedItem.content,
                }, {
                  where: {
                    name: updatedItem.name,
                  },
                });
              }
            );
  },

  findOne(name) {
    return Info.sync()
            .then(
              function() {
                return Info.findOne({
                  where: {
                    name: name,
                  },
                });
              }
            );
  },
};
