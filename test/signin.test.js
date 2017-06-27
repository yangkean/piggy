const supertest = require('supertest');
const app = require('../index');
const agent = supertest(app);
const UserModel = require('../models/user');

describe('登录功能的测试', function() {
  before(function(done) {
    UserModel.create({
      username: '_明朝啊$',
      uid: '2b9915d7a49689367724b6369aea3425510a2deaad36e1dddefa8ba64b084f77',
      website: '',
      email: 'aa@bb.com',
      password: '$2a$10$0q7Cyk.Vvjhb8wM9mZjJn.ZNfnxkJ9HANYkqZwbvTx8moRZ4WHodG',
    })
    .then(function() {
      done();
    })
    .catch(done);
  });

  after(function(done) {
    UserModel.delete('_明朝啊$')
    .then(function() {
      done();
    })
    .catch(done);
  });

  it('登录页面访问测试', function(done) {
    agent
      .get('/signin')
      .expect(200)
      .end(done);
  });

  it('用户名不正确测试', function(done) {
    agent
      .post('/signin')
      .type('form')
      .field('username', '_明朝啊')
      .field('password', '123456')
      .expect(302)
      .expect('Location', '/signin')
      .end(done);
  });

  it('密码不正确测试', function(done) {
    agent
      .post('/signin')
      .type('form')
      .field('username', '_明朝啊$')
      .field('password', '123457')
      .expect(302)
      .expect('Location', '/signin')
      .end(done);
  });

  it('登录成功测试', function(done) {
    agent
      .post('/signin')
      .type('form')
      .field('username', '_明朝啊$')
      .field('password', '123456')
      .expect(302)
      .expect('Location', '/posts')
      .end(done);
  });
});
