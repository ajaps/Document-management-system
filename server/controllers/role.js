import models from '../models/index';


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

module.exports = {
  getAllRoles,
};

