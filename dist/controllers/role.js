'use strict';

var _helper = require('../helpers/helper');

var _helper2 = _interopRequireDefault(_helper);

var _index = require('../models/index');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
   * gets all available roles in the database
   * @function getAllRoles
   * @param {object} request request
   * @param {object} response response
   * @return {object} object - information about the status of the request
   */
var getAllRoles = function getAllRoles(request, response) {
  _index2.default.Role.findAndCountAll().then(function (roles) {
    response.status(200).json({
      roleCount: roles.count,
      message: 'roles retrieved successfully',
      role: roles.rows
    });
  });
};

/**
   * creates new role
   * @function createRole
   * @param {object} request request
   * @param {object} response response
   * @return {object} object - information about the status of the request
   */
var createRole = function createRole(request, response) {
  var isString = _helper2.default.verifyString(request.body.roleName);
  if (!isString) {
    return response.status(406).json({
      message: 'roleName must be a string'
    });
  }
  _index2.default.Role.create({
    roleName: request.body.roleName
  }).then(function (role) {
    response.status(200).json({
      message: 'new role created successfully',
      role: role
    });
  });
};

/**
   * updates role name in the database
   * @function updateRole
   * @param {object} request request
   * @param {object} response response
   * @return {object} object - information about the status of the request
   */
var updateRole = function updateRole(request, response) {
  _helper2.default.verifyIsInt(request).then(function (result) {
    var verifiedParams = result.mapped();
    var noErrors = result.isEmpty();
    if (!noErrors) {
      return response.status(412).json({ message: verifiedParams });
    }
    var roleId = Number(request.params.id);
    if (roleId === request.decoded.data.roleId) {
      return response.status(400).json({
        message: 'Admin role cannot be update'
      });
    }
    _index2.default.Role.update(request.body, { where: { id: roleId } }).then(function () {
      response.status(200).json({
        message: 'updated successfully'
      });
    }).catch(function (error) {
      response.status(409).json({
        message: 'An error occured updating roleName',
        error: error.errors
      });
    });
  });
};

module.exports = {
  getAllRoles: getAllRoles,
  createRole: createRole,
  updateRole: updateRole
};