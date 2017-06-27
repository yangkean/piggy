const expect = require('chai').expect;
const supertest = require('supertest');
const app = require('../index');
const agent = supertest.agent(app);
const UserModel = require('../models/user');

describe('主页相关的测试', function() {
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

  afterEach(function(done) {
    agent
      .get('/signout')
      .end(done);
  });

  it('根目录跳转测试', function(done) {
    agent
      .get('/')
      .expect(302)
      .expect('Location', '/home')
      .end(done);
  });

  it('主页访问测试', function(done) {
    agent
      .get('/home')
      .expect(200)
      .end(done);
  });

  it('非管理员无法进入主页编辑界面测试', function(done) {
    agent
      .post('/signin')
      .type('form')
      .field('username', '_明朝啊$')
      .field('password', '123456')
      .end(function(err, res) {
        if(err) return done(err);

        agent
          .get('/home/editing')
          .end(function(err, res) {
            expect(res.text).to.be.equal('404 Not Found');

            done();
          });
      });
  });

  it('管理员可以进入主页编辑页面测试', function(done) {
    agent
      .post('/signin')
      .type('form')
      .field('username', 'Sam Yang')
      .field('password', 'sam')
      .end(function(err, res) {
        if(err) return done(err);

        agent
          .get('/home/editing')
          .expect(200)
          .end(done);
      });
  });

  it('管理员编辑成功测试', function(done) {
    agent
      .post('/signin')
      .type('form')
      .field('username', 'Sam Yang')
      .field('password', 'sam')
      .end(function(err, res) {
        if(err) return done(err);

        agent
          .post('/home/editing')
          .type('form')
          .field('introduction', '# Piggy\n\n曾梦想仗剑走天涯。\n\nWritten by Sam Yang')
          .field('email', 'bb@cc.com')
          .field('github', 'https://github.com')
          .field('weibo', 'http://weibo.com')
          .field('twitter', 'https://twitter.com')
          .expect(302)
          .expect('Location', '/home')
          .end(done);
      });
  });

  it('非管理员不可以向编辑页发送数据测试', function(done) {
    agent
      .get('/signout')
      .end(function(err, res) {
        if(err) return done(err);

        agent
          .post('/home/editing')
          .type('form')
          .field('introduction', '# Piggy\n\n曾梦想仗剑走天涯。\n\nWritten by Sam Yang')
          .field('email', 'bb@cc.com')
          .field('github', 'https://github.com')
          .field('weibo', 'http://weibo.com')
          .field('twitter', 'https://twitter.com')
          .end(function(err, res) {
            expect(res.text).to.be.equal('You have no permission to do this!');

            done();
          });
      });
  });
});
