import helper from '../helpers/helper';
import models from '../models/index';


/**
   * gets all available roles in the database
   * @function getAllRoles
   * @param {object} request request
   * @param {object} response response
   * @return {object} object - information about the status of the request
   */
const getAllRoles = (request, response) => {
  models.Role.findAndCountAll()
  .then((roles) => {
    response.status(200).json({
      roleCount: roles.count,
      message: 'roles retrieved successfully',
      role: roles.rows,
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
const createRole = (request, response) => {
  const isString = helper.verifyString(request.body.roleName);
  if (!isString) {
    return response.status(406).json({
      message: 'roleName must be a string',
    });
  }
  models.Role.create({
    roleName: request.body.roleName,
  })
  .then((role) => {
    response.status(200).json({
      message: 'new role created successfully',
      role,
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
const updateRole = (request, response) => {
  helper.verifyIsInt(request)
  .then((result) => {
    const verifiedParams = result.mapped();
    const noErrors = result.isEmpty();
    if (!noErrors) {
      return response.status(412).json({ message: verifiedParams });
    }
    const roleId = Number(request.params.id);
    if (roleId === request.decoded.data.roleId) {
      return response.status(400).json({
        message: 'Admin role cannot be update',
      });
    }
    models.Role.update(request.body, { where: { id: roleId } })
    .then(() => {
      response.status(200).json({
        message: 'updated successfully',
      });
    })
    .catch((error) => {
      response.status(409).json({
        message: 'An error occured updating roleName',
        error: error.errors,
      });
    });
  });
};


module.exports = {
  getAllRoles,
  createRole,
  updateRole,
};

