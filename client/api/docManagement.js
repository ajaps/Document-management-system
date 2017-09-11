import axios from 'axios';


/**
* Logs into to the API to retrieve Token
* @param {String} email - user email
* @param {String} password - user password
* @returns {promise} - A JSON object contianing relevant information
*/
const login = (email, password) =>
  // const LOGIN_URL = 'https://dmsys.herokuapp.com/api/v1/users/login';
  axios.post('http://localhost:3004/api/v1/users/login', {
    email,
    password
  });

/**
* Logs into to the API to retrieve Token
* @param {String} username - username
* @param {String} email - user email
* @param {String} password - user password
* @returns {promise} - A JSON object contianing relevant information
*/
const register = (username, email, password) =>
  // const LOGIN_URL = 'https://dmsys.herokuapp.com/api/v1/users/login';
  axios.post('http://localhost:3004/api/v1/users', {
    email,
    password,
    username,
  });


module.exports = {
  login,
  register,
};
