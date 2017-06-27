const supertest = require('supertest');
const app = require('../index');
const agent = supertest.agent(app); // cookie 持久化
const UserModel = require('../models/user');

describe('登出功能的测试', function() {
  before(function(done) {
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
        .end(done);
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

  it('登出成功测试', function(done) {
    agent
      .get('/signout')
      .expect(302)
      .expect('Location', '/home')
      .end(done);
  });
});
