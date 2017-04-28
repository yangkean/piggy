exports = module.exports = function(app) {
  app.get('/', (req, res) => {
    res.redirect('/home');
  });

  app.use('/home', require('./home'));
  app.use('/signup', require('./signup'));
  app.use('/signin', require('./signin'));
  app.use('/blogs', require('./blogs'));
};