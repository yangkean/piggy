const expect = require('chai').expect;
const supertest = require('supertest');
const app = require('../index');
const agent = supertest.agent(app);
const UserModel = require('../models/user');
const PostModel = require('../models/post');
const CommentModel = require('../models/comment');

describe('博客页相关的测试', function() {
  before(function(done) {
    Promise.all([
      PostModel.create({
        title: '样本',
        tag: '',
        postId: '6661c42b523f5e2352b21d30b83192820089fa43ba6d7f219afd3536dc78dea6',
        content: '古今多少事，都付笑谈中！',
        pv: 0,
        commentsCount: 0,
      }),
      UserModel.create({
        username: '_明朝啊$',
        uid: '2b9915d7a49689367724b6369aea3425510a2deaad36e1dddefa8ba64b084f77',
        website: '',
        email: 'aa@bb.com',
        password: '$2a$10$0q7Cyk.Vvjhb8wM9mZjJn.ZNfnxkJ9HANYkqZwbvTx8moRZ4WHodG',
      })
      .then(function() {
        agent
          .post('/signin')
          .type('form')
          .field('username', '_明朝啊$')
          .field('password', '123456')
          .redirects();
      })
    ])
    .then(
      function() {
        done();
      }
    )
    .catch(done);
  });

  after(function(done) {
    Promise.all([
      UserModel.delete('_明朝啊$'),
      PostModel.delete('样本'),
      CommentModel.delete('6661c42b523f5e2352b21d30b83192820089fa43ba6d7f219afd3536dc78dea6'),
    ])
    .then(
      function() {
        done();
      }
    )
    .catch(done);
  });

  it('非管理员无法进入新建博客页面测试', function(done) {
    agent
      .get('/posts/creation')
      .end(function(err, res) {
        expect(res.text).to.be.equal('404 Not Found');

        done();
      });
  });

  it('访问不存在博客测试', function(done) {
    agent
      .get('/posts/2eb5f25afac62af2c')
      .end(function(err, res) {
        expect(res.text).to.be.equal('404 Not Found');

        done();
      });
  });

  it('非管理员无法访问博客修改页面测试', function(done) {
    agent
      .get('/posts/6661c42b523f5e2352b21d30b83192820089fa43ba6d7f219afd3536dc78dea6/editing')
      .end(function(err, res) {
        expect(res.text).to.be.equal('404 Not Found');

        done();
      });
  });

  it('未登录无法发表评论测试', function(done) {
    agent
      .get('/signout')
      .end(function(err, res) {
        if(err) return done(err);

        agent
          .post('/posts/6661c42b523f5e2352b21d30b83192820089fa43ba6d7f219afd3536dc78dea6')
          .type('form')
          .field('comment', '一楼是我的！')
          .end(function(err, res) {
            expect(res.text).to.be.equal('You have no permission to do this!');

            done();
          });
      });
  });

  it('发布博客成功测试', function(done) {
    agent
      .post('/signin')
      .type('form')
      .field('username', 'Sam Yang')
      .field('password', 'sam')
      .redirects()
      .end(function(err, res) {
        if(err) return done(err);

        agent
          .post('/posts/creation')
          .type('form')
          .field('title', '备胎样本')
          .field('tag', '')
          .field('content', '古今多少事，都付笑谈中！')
          .expect(302)
          .expect('Location', '/posts')
          .end(done);
      });
  });

  it('管理员博客修改成功测试', function(done) {
    agent
      .post('/posts/6661c42b523f5e2352b21d30b83192820089fa43ba6d7f219afd3536dc78dea6/editing')
      .field('title', '备胎样本2')
      .field('tag', '')
      .field('content', '曾梦想仗剑走天涯！')
      .expect(302)
      .expect('Location', '/posts/6661c42b523f5e2352b21d30b83192820089fa43ba6d7f219afd3536dc78dea6')
      .end(done);
  });

  it('输入评论为空测试', function(done) {
    agent
      .post('/posts/6661c42b523f5e2352b21d30b83192820089fa43ba6d7f219afd3536dc78dea6')
      .type('form')
      .field('comment', '')
      .expect(302)
      .expect('Location', '/posts/6661c42b523f5e2352b21d30b83192820089fa43ba6d7f219afd3536dc78dea6')
      .end(done);
  });

  it('成功发表评论测试', function(done) {
    agent
      .post('/posts/6661c42b523f5e2352b21d30b83192820089fa43ba6d7f219afd3536dc78dea6')
      .type('form')
      .field('comment', '一楼是我的！这是测试！这是测试！')
      .redirects()
      .end(function(err, res) {
        expect(/一楼是我的！这是测试！这是测试！/.test(res.text)).to.be.ok;

        done();
      });
  });

  it('成功回复评论测试', function(done) {
    agent
      .get('/posts/6661c42b523f5e2352b21d30b83192820089fa43ba6d7f219afd3536dc78dea6')
      .end(function(err, res) {
        const repliedCommentId = res.text.match(/.+6661c42b523f5e2352b21d30b83192820089fa43ba6d7f219afd3536dc78dea6\/(\d+).+/)[1];

        agent
          .post(`/posts/6661c42b523f5e2352b21d30b83192820089fa43ba6d7f219afd3536dc78dea6/${repliedCommentId}`)
          .type('form')
          .field('comment', '我来回复一楼！这是测试！这是测试！')
          .redirects()
          .end(function(err, res) {
            expect(/我来回复一楼！这是测试！这是测试！/.test(res.text)).to.be.ok;

            done();
          });
      });
  });
});
