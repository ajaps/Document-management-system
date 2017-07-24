import dotenv from 'dotenv';

dotenv.config();

module.exports = {
  development: {
    username: process.env.DEV_USERNAME,
    password: process.env.DEV_PASSW,
    database: process.env.DEV_DATABASE,
    host: process.env.HOST,
    dialect: process.env.DIALECT,
  },
  test: {
    username: 'root',
    password: null,
    database: 'database_test',
    host: '127.0.0.1',
    dialect: 'postgres'
  },
  production: {
    username: process.env.PROD_USERNAME,
    password: process.env.PROD_PASSW,
    database: process.env.PROD_DATABASE,
    host: process.env.HOST,
    dialect: process.env.DIALECT
  }
};
