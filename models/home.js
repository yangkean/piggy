const Home = require('./db').Home;

exports = module.exports = {
  edit(home) {
    return Home.sync()
            .then(
              function() {
                return Home.findOne({where: {owner: home.owner}});
              }
            )
            .then(
              function(result) {
                if(result) {
                  return Home.update({
                      introduction: home.introduction,
                      email: home.email,
                      github: home.github,
                      weibo: home.weibo,
                      twitter: home.twitter,
                  }, {where: {owner: home.owner}});
                }

                return Home.create(home);
              }
            );
  },

  get(owner) {
    return Home.sync()
            .then(
              function() {
                return Home.findOne({
                  where: {
                    owner: owner,
                  },
                });
              }
            );
  }
};
