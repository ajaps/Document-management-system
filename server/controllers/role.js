import models from '../models/index';
import helper from '../helpers/helper';


const getAllRoles = (request, response) => {
  models.Role.findAndCountAll()
  .then((roles) => {
    response.status(200).json({
      roleCount: roles.count,
      message: 'successful',
      role: roles.rows,
    });
  })
  .catch((error) => {
    response.status(400).json({
      message: 'An error occured retrieving roles',
      data: error,
    });
  });
};

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
      message: 'successful',
      role,
    });
  })
  .catch((error) => {
    response.status(400).json({
      message: 'An error occured retrieving roles',
      data: error,
    });
  });
};

const updateRole = (request, response) => {
  const roleId = request.params.id;
  if (roleId === request.decoded.data.roleId) {
    return response.status(400).json({
      message: 'The Admin role cannot be update',
    });
  }
  models.Role.update(request.body, { where: { id: roleId } })
  .then(() => {
    response.status(200).json({
      message: 'updated successfully',
    });
  })
  .catch((error) => {
    response.status(400).json({
      message: 'An error occured updating roleName',
      error,
    });
  });
};


module.exports = {
  getAllRoles,
  createRole,
  updateRole,
};

