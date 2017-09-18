import axios from 'axios';

axios.defaults
  .headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

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


/**
* Create new document
* @param {String} title - document title
* @param {String} content - document content
* @param {String} access - document access type
* @returns {promise} - A JSON object contianing relevant information
*/
const newDoc = (title, content, access) => {
  axios.defaults
    .headers.common.Authorization = localStorage.getItem('userToken');
  // const LOGIN_URL = 'https://dmsys.herokuapp.com/api/v1/users/login';
  return axios({
    method: 'post',
    url: 'http://localhost:3004/api/v1/documents',
    data: {
      title,
      content,
      access,
    }
  });
};

/**
* Gets all documents using the API
* @returns {promise} - A JSON object contianing relevant information
*/
const fetchAllDocs = () => {
  axios.defaults
    .headers.common.Authorization = localStorage.getItem('userToken');
  // const LOGIN_URL = 'https://dmsys.herokuapp.com/api/v1/users/login';
  return axios({
    method: 'get',
    url: 'http://localhost:3004/api/v1/documents',
  });
};

/**
* delete documents by ID using the API
* @param {String} docId - document ID
* @returns {promise} - A JSON object contianing relevant information
*/
const callDeleteDoc = (docId) => {
  axios.defaults
    .headers.common.Authorization = localStorage.getItem('userToken');
  // const LOGIN_URL = 'https://dmsys.herokuapp.com/api/v1/users/login';
  return axios({
    method: 'delete',
    url: `http://localhost:3004/api/v1/documents/${docId}`,
  });
};

/**
* Get documents by ID using the API
* @param {String} docId - document ID
* @returns {promise} - A JSON object contianing relevant information
*/
const fetchDocById = (docId) => {
  axios.defaults
    .headers.common.Authorization = localStorage.getItem('userToken');
  // const LOGIN_URL = 'https://dmsys.herokuapp.com/api/v1/users/login';
  return axios({
    method: 'get',
    url: `http://localhost:3004/api/v1/documents/${docId}`,
  });
};

/**
* Update existing document by ID
* @param {Object} docAttributes - document content
* @param {String} docId - document ID
* @returns {promise} - A JSON object contianing relevant information
*/
const updateDocById = (docAttributes, docId) => {
  axios.defaults
    .headers.common.Authorization = localStorage.getItem('userToken');
  // const LOGIN_URL = 'https://dmsys.herokuapp.com/api/v1/users/login';
  return axios({
    method: 'put',
    url: `http://localhost:3004/api/v1/documents/${docId}`,
    data: docAttributes
  });
};

/**
* Update existing document by ID
* @param {Object} docAttributes - document content
* @param {String} docId - document ID
* @returns {promise} - A JSON object contianing relevant information
*/
const searchDocById = (searchString) => {
  axios.defaults
    .headers.common.Authorization = localStorage.getItem('userToken');
  // const LOGIN_URL = 'https://dmsys.herokuapp.com/api/v1/users/login';
  return axios({
    method: 'get',
    url: `http://localhost:3004/api/v1/search/documents?q=${searchString}`,
  });
};

module.exports = {
  login,
  register,
  newDoc,
  fetchAllDocs,
  callDeleteDoc,
  fetchDocById,
  updateDocById,
  searchDocById,
};
