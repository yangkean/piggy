const path = require('path');
const express = require('express');
const formidable = require('express-formidable'); // 处理表单提交的中间件
const app = express();
const routes = require('./routes');

// 设置静态资源文件目录
app.use(express.static(path.join(__dirname, 'public')));

// 设置模版文件目录和模版解析引擎
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// 处理表单提交
app.use(formidable({
  encoding: 'utf-8',
}));

// 绑定路由
routes(app);

app.listen(3000, () => {
  console.log('Server is listening on http://localhost:3000');
});
