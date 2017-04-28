exports = module.exports = {
  site: {
    title: 'piggy',
  },
  port: 3000,
  session: {
    name: 'piggy',
    secret: 'piggy',
    maxAge: 2592000000,
  },
  mysql: {
    database: 'CMS',
    username: 'root',
    password: '123456',
    host: 'localhost',
    dialect: 'mysql',
    pool: {
      max: 6,
      min: 0,
      idle: 12000,
    },
  },
};
