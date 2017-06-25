const path = require('path');
const express = require('express');
const formidable = require('express-formidable'); // 处理表单提交的中间件
const session = require('express-session'); // express 的 session 中间件
const flash = require('connect-flash'); // 显示通知的中间件
const config = require('config-lite')(__dirname); // 读取配置文件的中间件
const Sequelize = require('sequelize'); // MySQL ORM 中间件
const SequelizeStore = require('connect-session-sequelize')(session.Store); // 将 session 保存到数据库的中间件
const helmet = require('helmet'); // 通过适当地设置http头来防范一些著名网络攻击的中间件
const schedule = require('node-schedule'); // 定时任务
const app = express();
const routes = require('./routes');
const backup = require('./backup');
const sequelize = require('./models/db').dbConnection;
const sequelizeStore = new SequelizeStore({
  db: sequelize,
});

// 设置静态资源文件目录
app.use(express.static(path.join(__dirname, 'public')));

// 设置模版文件目录和模版解析引擎
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(helmet());

app.use(session({
  name: config.session.name, // `session ID` cookie 的名字
  secret: config.session.secret, // 必需，用来给 `session ID` cookie 签名
  cookie: {
    maxAge: config.session.maxAge, // 用来结合当前服务器时间计算 session 过期时间的最大毫秒数
  },
  store: sequelizeStore,
  resave: true, // 每次请求都重新保存 session（已存在），不管 session 是否被修改
  saveUninitialized: false, // 只在新的默认 session 被修改时才保存新 session，避免保存过多无意义的 session
}));
sequelizeStore.sync(); // 采用默认的 Session 模型用于数据库连接

app.use(flash()); // 注意 `connect-flash` 中间件会在初始化时修改 session（增加 `flash` 属性并赋值为 `{}`），导致保存了无意义的 session

// 处理表单提交
app.use(formidable({
  encoding: 'utf8mb4',
}));

// 设置模版全局变量
app.locals.site = {
  domain: config.site.domainName, // 网站主域名
  title: config.site.title, // 网站名字
  owner: config.site.owner, // 网站拥有者
};

// 设置模版常用的变量
app.use((req, res, next) => {
  res.locals.success = req.flash('success').toString(); // `req.flash(key)`会返回一个 'key' 类型的包含通知信息的数组
  res.locals.error = req.flash('error').toString();
  res.locals.user = req.session.user; // 可以用 `req.session`访问 session 数据
  res.locals.postId = null;
  res.locals.path = req.path;
  next();
});

// 绑定路由
routes(app);

// 错误处理
app.use((err, req, res, next) => {
  console.error('\x1b[31m%s\x1b[0m', err.stack);

  res.status(500).send('Something broke!');
});

// 数据库备份
schedule.scheduleJob({hour: 1, minute: 0}, backup);

app.listen(config.port, () => {
  console.log(`Server is listening on http://localhost:${config.port}`);
});
