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


const searchDocument = (request, response) => {
  const searchTerm = request.query.q;
  const isAdmin = RegExp('admin', 'gi').test(request.decoded.data.roleType);
  let query;
  if (isAdmin) {
    query = { order: [['createdAt', 'DESC']] };
  } else {
    query = { order: [['createdAt', 'DESC']],
      where: {
        $or: [
          { userId: request.decoded.data.userId },
          { access: 'public' }
        ]
      }
    };
  }
  models.Document.findAll(query)
  .then((documents) => {
    const filteredDocs = documents.filter(document =>
    RegExp(searchTerm, 'gi').test(document.title));
    response.status(200).json({ Documents: filteredDocs });
  })
  .catch((error) => {
    response.status(400).json({
      message: 'An error occured retrieving documents',
      data: error,
    });
  });
};

module.exports = {
  searchUser,
  searchDocument,
};
