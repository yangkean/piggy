const exec = require('child_process').exec;
const config = require('config-lite')(__dirname);
const backupCommand = `mysqldump -u ${config.mysql.username} --password=${config.mysql.password} --add-locks ${config.mysql.database} comment home info post user > ./backup/cms.sql`;

exports = module.exports = () => {
  exec(backupCommand);

  console.log('\x1b[34m%s\x1b[0m', 'backup is done!');
};
