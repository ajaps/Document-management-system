import { paginate } from './pagination';

const getAllDocuments = (request) => {
  const getPaginate = paginate(request);
  const isAdmin = request.decoded.data.roleId === 1;
  if (isAdmin) {
    return { order: [['createdAt', 'DESC']],
      attributes: { exclude: ['roleId'] },
      offset: getPaginate[0],
      limit: getPaginate[1],
    };
  }
  return {
    order: [['createdAt', 'DESC']],
    offset: getPaginate[0],
    limit: getPaginate[1],
    attributes: { exclude: ['roleId'] },
    where: {
      $or: [
        { userId: request.decoded.data.id },
        { access: 'public' },
        { access: 'role', roleId: request.decoded.data.roleId },
      ]
    },
  };
};

const getAllUsers = (request) => {
  const getPaginate = paginate(request);
  const isAdmin = request.decoded.data.roleId === 1;
  if (isAdmin) {
    return {
      order: [['roleId', 'ASC']],
      offset: getPaginate[0],
      limit: getPaginate[1],
    };
  }
  return {
    attributes: ['id', 'username', 'roleId'],
    order: [['roleId', 'ASC']],
    offset: getPaginate[0],
    limit: getPaginate[1],
  };
};

const getRoles = (request) => {
  const getPaginate = paginate(request);
  const isAdmin = request.decoded.data.roleId === 1;
  if (isAdmin) {
    return {
      offset: getPaginate[0],
      limit: getPaginate[1],
    };
  }
  return {
    offset: getPaginate[0],
    limit: getPaginate[1],
  };
};

const getDocById = (request) => {
  const documentId = request.params.id;
  const isAdmin = request.decoded.data.roleId === 1;
  if (isAdmin) {
    return { where: { id: documentId }, attributes: { exclude: ['roleId'] }, };
  }
  return {
    where: { id: documentId,
      $or: [
        { access: 'public' },
        { userId: request.decoded.data.id },
        { $and: [
          { roleId: request.decoded.data.roleId },
          { access: 'role' },
        ] }
      ] },
    attributes: { exclude: ['roleId'] },
  };
};

const updateUser = (request) => {
  const userId = request.params.id;
  return {
    where: { id: userId },
    individualHooks: true,
  };
};

const updateDeleteDoc = (request) => {
  const documentId = request.params.id;
  const isAdmin = request.decoded.data.roleId === 1;
  if (isAdmin) {
    return {
      where: { id: documentId },
    };
  }
  return {
    where: { id: documentId, userId: request.decoded.data.id },
  };
};

const getDocByUserId = (request) => {
  const userId = request.params.id;
  const isAdmin = request.decoded.data.roleId === 1;
  if (isAdmin || userId === request.decoded.data.id) {
    return { where: { id: userId }, attributes: { exclude: ['roleId'] }, };
  }
  return { where: { id: userId,
    $or: [
        { roleId: request.decoded.data.roleId },
        { access: 'public' }
    ], },
    attributes: { exclude: ['roleId'] },
  };
};

const getUserById = (request) => {
  const userId = request.params.id;
  const isAdmin = request.decoded.data.roleId === 1;
  if (isAdmin) {
    return {
      where: { id: userId }
    };
  }
  return {
    attributes: ['id', 'username', 'roleId'],
    where: { id: userId }
  };
};

const getDocumentsByRole = (request) => {
  const getPaginate = paginate(request);
  const roleId = Number(request.params.id);
  const isAdmin = request.decoded.data.roleId === 1;
  if (isAdmin) {
    return { where: { roleId, access: 'role' },
      attributes: { exclude: ['roleId'] },
      order: [['createdAt', 'DESC']],
      offset: getPaginate[0],
      limit: getPaginate[1], };
  }
  return { where: { roleId: request.decoded.data.roleId,
    access: 'role', },
    attributes: { exclude: ['roleId'] },
    offset: getPaginate[0],
    limit: getPaginate[1],
  };
};

const deepSearch = (request) => {
  const searchQuery = [];
  const splitString = (request.query.q).split(' ');
  splitString.forEach((query) => {
    searchQuery.push({ $iLike: `%${query}%` });
  });
  return searchQuery;
};

const searchDocuments = (request) => {
  const getPaginate = paginate(request);
  const searchQuery = deepSearch(request);
  const isAdmin = request.decoded.data.roleId === 1;
  if (isAdmin) {
    return { order: [['createdAt', 'DESC']],
      attributes: { exclude: ['roleId'] },
      where: {
        title: {
          $or: searchQuery
        }
      },
      offset: getPaginate[0],
      limit: getPaginate[1],
    };
  }
  return {
    order: [['createdAt', 'DESC']],
    attributes: { exclude: ['roleId'] },
    where: {
      $or: [
        { userId: request.decoded.data.id },
        { access: 'public' },
        { access: 'role', roleId: request.decoded.data.roleId },
      ],
      title: {
        $or: searchQuery
      }
    },
    offset: getPaginate[0],
    limit: getPaginate[1],
  };
};

const searchAllUsers = (request) => {
  const searchQuery = deepSearch(request);
  const getPaginate = paginate(request);
  const isAdmin = request.decoded.data.roleId === 1;
  if (isAdmin) {
    return {
      where: {
        username: {
          $or: searchQuery
        }
      },
      order: [['roleId', 'ASC']],
      offset: getPaginate[0],
      limit: getPaginate[1],
    };
  }
  return {
    where: {
      username: {
        $or: searchQuery
      }
    },
    attributes: ['id', 'username', 'roleId'],
    order: [['roleId', 'ASC']],
    offset: getPaginate[0],
    limit: getPaginate[1],
  };
};

module.exports = {
  getAllDocuments,
  getRoles,
  getAllUsers,
  getDocById,
  getUserById,
  getDocByUserId,
  getDocumentsByRole,
  searchDocuments,
  updateUser,
  updateDeleteDoc,
  searchAllUsers,
};
