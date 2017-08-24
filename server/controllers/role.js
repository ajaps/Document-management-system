import { verifyString, verifyIsInt } from '../helpers/validation';
import { getRoles } from '../helpers/query';
import { paginateResult } from '../helpers/pagination';
import models from '../models';

const Role = models.Role;

/**
   * gets all available roles in the database
   * @function getAllRoles
   * @param {object} request request
   * @param {object} response response
   * @return {object} object - information about the status of the request
   */
const getAllRoles = (request, response) => {
  const query = getRoles(request);
  Role.findAndCountAll(query)
  .then(roles => response.status(200).json(
      paginateResult(roles, query, 'roles')
    )
  )
  .catch(error => response.status(500).json({
    error: 'An unexpected error occurred',
    detailed_error: error,
    more_info: 'https://dmsys.herokuapp.com/#find-matching-instances-of-role',
  }));
};


/**
   * creates new role
   * @function createRole
   * @param {object} request request
   * @param {object} response response
   * @return {object} object - information about the status of the request
   */
const createRole = (request, response) => {
  const isString = verifyString(request.body.roleName);
  if (!isString) {
    return response.status(406).json({
      error: 'roleName must be a string',
      more_info: 'https://dmsys.herokuapp.com/#create-new-role',
    });
  }
  Role.create({
    roleName: request.body.roleName,
  })
  .then(role => response.status(201).json({
    message: 'new role created successfully',
    role,
  })
  )
  .catch(error => response.status(409).json({
    error: `Cannot create role with specified ID, ensure the roleName
      doesn't already exist in the database`,
    detailed_error: error.message,
    roleName: (request.body.roleName).toLowerCase(),
    more_info: 'https://dmsys.herokuapp.com/#create-new-role',
  })
  );
};

/**
   * updates role name in the database
   * @function updateRole
   * @param {object} request request
   * @param {object} response response
   * @return {object} object - information about the status of the request
   */
const updateRole = (request, response) => {
  verifyIsInt(request)
  .then((result) => {
    const verifiedParams = result.mapped();
    const noErrors = result.isEmpty();
    if (!noErrors) {
      return response.status(412).json({ message: verifiedParams });
    }
    const roleId = Number(request.params.id);
    if (roleId === request.decoded.data.roleId) {
      return response.status(403).json({
        error: 'This action is forbidden',
        more_info: 'https://dmsys.herokuapp.com/#update-role',
      });
    }
    Role.update(request.body, { where: { id: roleId } })
    .then(() => response.status(200).json({
      message: 'updated successfully',
    })
    )
    .catch(error => response.status(409).json({
      error: 'An unexpected error occurred',
      detailed_error: error.errors,
      more_info: 'https://dmsys.herokuapp.com/#update-role',
    })
    );
  });
};


module.exports = {
  getAllRoles,
  createRole,
  updateRole,
};

