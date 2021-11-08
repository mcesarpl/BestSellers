const env = require('env-var');

const settings = {
  NOVE_ENV: env.get('NODE_ENV').required().asString(),
  dbTableName: env.get('DbTableName').required().asString(),
  schedulerEnabled: env.get('schedulerEnabled').required().asString(),
};

module.exports = settings;
