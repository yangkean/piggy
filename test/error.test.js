const expect = require('chai').expect;
const supertest = require('supertest');
const app = require('../index');
const agent = supertest(app);

describe('错误处理的测试', function() {
  it('访问不存在的路径或无路径访问权限测试', function(done) {
    agent
      .get('/home/lihaile')
      .end(function(err, res) {
        expect(res.text).to.be.equal('404 Not Found');

        done();
      });
  });

  it('服务器内部发生错误测试', function(done) {
    agent
      .post('/signup')
      .type('form')
      .field('username', [])
      .field('website', '')
      .field('email', 'aa@bb.com')
      .field('password', '123456')
      .field('repassword', '123456')
      .expect(500)
      .end(function(err, res) {
        expect(res.text).to.be.equal('Something broke!');

        done();
      });
  });
});
