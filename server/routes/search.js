import models from '../models/index';

const searchUser = (request, response) => {
  const searchTerm = request.query.q;
  models.User.findAll({ attributes: ['id', 'email', 'roleId'],
    order: [['roleId', 'ASC']],
  }).then((users) => {
    const filteredUsers = users.filter(user =>
    RegExp(searchTerm, 'gi').test(user.email));
    response.status(200).json({ users: filteredUsers });
  })
  .catch((error) => {
    response.status(404).json(
      { message: 'An unexpected error occured, try agian later', error });
  });
};


module.exports = {
  searchUser,
};
