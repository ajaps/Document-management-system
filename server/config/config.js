require('dotenv').config();

module.exports = {
  development: {
    username: 'framky',
    password: 'DEV_PASW',
    database: 'database_development',
    host: '127.0.0.1',
    dialect: 'postgres'
  },
  test: {
    use_env_variable: 'DATABASE_URL',
    dialect: 'postgres'
  },
  production: {
    use_env_variable: 'E_DATABASE_URL',
    dialect: 'postgres'
  }
};

