const path = require('path');
const express = require('express');
const app = express();

// 设置静态资源文件目录
app.use(express.static(path.join(__dirname, 'public')));

// 设置模版文件目录和模版解析引擎
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('home');
});

app.get('/signup', (req, res) => {
  res.render('signup');
});

app.get('/signin', (req, res) => {
  res.render('signin');
});

app.get('/blogs', (req, res) => {
  res.render('blogs', {posts: [{title: 'hello', content: 'Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est. Mauris placerat eleifend leo.'}, {title: 'hello', content: 'Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est. Mauris placerat eleifend leo.'}]});
});

app.listen(3000, () => {
  console.log('Server is listening on http://localhost:3000');
});
