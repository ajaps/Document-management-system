'use strict';

var _bcrypt = require('bcrypt');

var _bcrypt2 = _interopRequireDefault(_bcrypt);

var _index = require('../models/index');

var _index2 = _interopRequireDefault(_index);

var _helper = require('../helpers/helper');

var _helper2 = _interopRequireDefault(_helper);

var _authentication = require('../middleware/authentication');

var _authentication2 = _interopRequireDefault(_authentication);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var saltRounds = 10;

/**
   * Creates new user
   * @function createUser
   * @param {object} request request
   * @param {object} response response
   * @return {object} object - information about the status of the request
   */
var createUser = function createUser(request, response) {
  _helper2.default.verifyUserParams(request).then(function (result) {
    var verifiedParams = result.mapped();
    var noErrors = result.isEmpty();
    if (!noErrors) {
      return response.status(412).json({ message: verifiedParams });
    }
    var password = request.body.password;
    var email = request.body.email;
    var hashPassword = _bcrypt2.default.hashSync(password, saltRounds);
    _index2.default.User.create({
      email: email,
      password: hashPassword
    }).then(function (user) {
      var userToken = _authentication2.default.setUserToken(user);
      var data = {
        message: 'New user created successfully',
        token: userToken
      };
      response.status(201).json(data);
    }).catch(function () {
      var data = {
        message: email + ' already exist',
        token: null
      };
      return response.status(409).json(data);
    });
  });
};

/**
   * login user, checks the availability of email and passowrd in the database
   * @function loginUser
   * @param {object} request request
   * @param {object} response response
   * @return {object} object - information about the status of the request
   */
var loginUser = function loginUser(request, response) {
  _helper2.default.verifyUserParams(request).then(function (result) {
    var verifiedParams = result.mapped();
    var noErrors = result.isEmpty();
    if (!noErrors) {
      return response.status(412).json({ message: verifiedParams });
    }
    var plainTextpassword = request.body.password;
    var email = request.body.email;
    var validUser = false;
    _index2.default.User.find({
      where: {
        email: email
      },
      include: [{ model: _index2.default.Role }]
    }).then(function (user) {
      validUser = _bcrypt2.default.compareSync(plainTextpassword, user.password);
      if (validUser) {
        var userInfo = {
          userId: user.id,
          roleType: user.Role.roleName,
          email: user.email,
          roleId: user.roleId
        };
        var userToken = _authentication2.default.setUserToken(userInfo);
        return response.status(202).json({ message: 'Logged in successful',
          token: userToken });
      }
      return response.status(401).json({ message: 'Invalid username or password',
        token: null });
    }).catch(function () {
      return response.status(404).json({ message: email + ' does not exist in the database',
        token: null });
    });
  });
};

/**
   * Gets all instance of user in the database
   * @function allUser
   * @param {object} request request
   * @param {object} response response
   * @return {object} object - information about the status of the request
   */
var allUser = function allUser(request, response) {
  var paginate = _helper2.default.paginate(request);
  _index2.default.User.findAndCountAll({ attributes: ['id', 'email', 'roleId'],
    order: [['roleId', 'ASC']],
    offset: paginate[0],
    limit: paginate[1]
  }).then(function (user) {
    return response.status(200).json({ Total_Users: user.count, users: user.rows });
  }).catch(function () {
    return response.status(404).json({ message: 'An unexpected error occured, try agian later' });
  });
};

/**
   * find user in the database by ID
   * @function findUser
   * @param {object} request request
   * @param {object} response response
   * @return {object} object - information about the status of the request
   */
var findUser = function findUser(request, response) {
  _helper2.default.verifyIsInt(request).then(function (result) {
    var verifiedParams = result.mapped();
    var noErrors = result.isEmpty();
    if (!noErrors) {
      return response.status(412).json({ message: verifiedParams });
    }
    var query = _helper2.default.findUserById(request);
    _index2.default.User.findAll(query).then(function (user) {
      return response.status(200).json({ user: user });
    });
  });
};

/**
   * Updats user attributes in the database
   * @function updateUser
   * @param {object} request request
   * @param {object} response response
   * @return {object} object - information about the status of the request
   */
var updateUser = function updateUser(request, response) {
  var userId = Number(request.params.id);
  var isAdmin = RegExp('admin', 'gi').test(request.decoded.data.roleType);
  request.body.roleId = isAdmin ? request.body.roleId : request.body.roleId = request.decoded.data.roleId;
  if (!isAdmin && userId !== request.decoded.data.userId) {
    return response.status(401).json({
      message: "Only an Admin can update another user's attributes",
      error: 401 });
  }
  if (request.body.roleId === undefined) {
    request.body.roleId = request.decoded.data.roleId;
  }
  if (request.body.password !== undefined) {
    request.body.password = _bcrypt2.default.hashSync(request.body.password, saltRounds);
  }
  _index2.default.User.update(request.body, {
    where: {
      id: request.params.id
    },
    returning: true,
    plain: true
  }).then(function (user) {
    return response.status(200).json({
      message: 'User updated successfully',
      result: user[1].dataValues });
  }).catch(function (error) {
    return response.status(409).json({
      message: 'Could not updating user details, verify the ID is valid',
      error: error.errors
    });
  });
};

/**
   * deletes user record from the database
   * @function deleteUser
   * @param {object} request request
   * @param {object} response response
   * @return {object} object - information about the status of the request
   */
var deleteUser = function deleteUser(request, response) {
  var deleteUserId = request.params.id;
  var isAdmin = request.decoded.data.roleId === 1;
  var query = void 0;
  if (isAdmin || Number(deleteUserId) === request.decoded.data.id) {
    query = { where: { id: deleteUserId } };
  } else {
    return response.status(401).json({
      message: "Only an Admin can delete another user's record",
      error: true });
  }
  _index2.default.User.destroy(query).then(function (user) {
    if (user === 0) {
      return response.status(404).json({
        message: 'User ID does not exist',
        user: user });
    }
    return response.status(200).json({
      message: 'User deleted successfully',
      user: user });
  });
};

module.exports = {
  createUser: createUser,
  loginUser: loginUser,
  allUser: allUser,
  findUser: findUser,
  updateUser: updateUser,
  deleteUser: deleteUser
};