const supertest = require('supertest'); // 用于测试 node HTTP 服务器的库
const app = require('../index');
const agent = supertest(app);
const UserModel = require('../models/user');

describe('注册功能的测试', function() {
  after(function(done) {
    UserModel.delete('_明朝啊$')
    .then(
      function() {
        done();
      }
    )
    .catch(done);
  });

  it('注册页面访问测试', function(done) {
    agent
      .get('/signup')
      .expect(200)
      .end(done);
  });

  it('错误用户名测试', function(done) {
    agent
      .post('/signup')
      .type('form')
      .field('username', '明朝')
      .field('website', '')
      .field('email', 'aa@bb.com')
      .field('password', '123456')
      .field('repassword', '123456')
      .expect(302)
      .expect('Location', '/signup')
      .end(done);
  });

  it('错误密码测试', function(done) {
    agent
      .post('/signup')
      .type('form')
      .field('username', '明朝啊')
      .field('website', '')
      .field('email', 'aa@bb.com')
      .field('password', '12345')
      .field('repassword', '12345')
      .expect(302)
      .expect('Location', '/signup')
      .end(done);
  });

  it('输入密码不一致测试', function(done) {
    agent
      .post('/signup')
      .type('form')
      .field('username', '明朝啊')
      .field('website', '')
      .field('email', 'aa@bb.com')
      .field('password', '123456')
      .field('repassword', '123457')
      .expect(302)
      .expect('Location', '/signup')
      .end(done);
  });

  it('注册成功测试', function(done) {
    agent
      .post('/signup')
      .type('form')
      .field('username', '_明朝啊$')
      .field('website', '')
      .field('email', 'aa@bb.com')
      .field('password', '123456')
      .field('repassword', '123456')
      .expect(302)
      .expect('Location', '/posts')
      .end(done);
  });

  it('用户名被占用测试', function(done) {
    agent
      .post('/signup')
      .type('form')
      .field('username', '_明朝啊$')
      .field('website', '')
      .field('email', 'aa@bb.com')
      .field('password', '123457')
      .field('repassword', '123457')
      .expect(302)
      .expect('Location', '/signup')
      .end(done);
  });
});
