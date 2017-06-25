exports = module.exports = function(app) {
  app.get('/', (req, res) => {
    res.redirect('/home');
  });

  app.use('/home', require('./home'));
  app.use('/signup', require('./signup'));
  app.use('/signin', require('./signin'));
  app.use('/signout', require('./signout'));
  app.use('/posts', require('./posts'));

  // 404 页面
  app.use((req, res) => {
    if(!res.headersSent) {
      res.send('404 Not Found');
    }
  });
};
