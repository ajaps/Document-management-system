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

const createRoles = (request, response) => {
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

module.exports = {
  getAllRoles,
  createRoles,
};

