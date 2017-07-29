import bcrypt from 'bcrypt';
import models from '../models/index';
import helper from '../helpers/helper';
import authentication from '../middleware/authentication';

const saltRounds = 10;

const createUser = (request, response) => {
  helper.verifyUserParams(request)
  .then((result) => {
    const verifiedParams = result.mapped();
    const noErrors = result.isEmpty();
    if (!noErrors) {
      response.status(412).json({ message: verifiedParams });
      return;
    }
    const password = request.body.password;
    const email = request.body.email;
    const hashPassword = bcrypt.hashSync(password, saltRounds);
    models.User.create({
      email,
      password: hashPassword,
    })
    .then((user) => {
      const userToken = authentication.setUserToken(user);
      const data = {
        message: 'New user created successfully',
        token: userToken,
      };
      response.status(201).json(data);
    })
    .catch(() => {
      const data = {
        message: `${email} already exist in the database`,
        token: null,
      };
      response.status(409).json(data);
    });
  });
};


const loginUser = (request, response) => {
  helper.verifyUserParams(request)
  .then((result) => {
    const verifiedParams = result.mapped();
    const noErrors = result.isEmpty();
    if (!noErrors) {
      response.status(412).json({ message: verifiedParams });
      return;
    }
    const plainTextpassword = request.body.password;
    const email = request.body.email;
    let validUser = false;
    models.User.find({
      where: {
        email,
      },
      include: [{ model: models.Role }],
    }).then((user) => {
      validUser = bcrypt.compareSync(plainTextpassword, user.password);
      if (validUser) {
        const userInfo = {
          userId: user.id,
          roleType: user.Role.roleName,
          email: user.email,
          roleId: user.roleId,
        };
        const userToken = authentication.setUserToken(userInfo);
        response.status(202).json(
          { message: 'Logged in successful',
            token: userToken });
      } else {
        response.status(401).json(
          { message: 'Invalid username or password',
            token: null });
      }
    })
    .catch(() => {
      response.status(404).json(
        { message: `${email} does not exist in the database`,
          token: null });
    });
  });
};


const allUser = (request, response) => {
  const paginate = helper.paginate(request);
  models.User.findAndCountAll({ attributes: ['id', 'email', 'roleId'],
    order: [['roleId', 'ASC']],
    offset: paginate[0],
    limit: paginate[1],
  }).then((user) => {
    response.status(200).json({ Total_Users: user.count, users: user.rows });
  })
  .catch(() => {
    response.status(404).json(
      { message: 'An unexpected error occured, try agian later', });
  });
};


const findUser = (request, response) => {
  const userId = request.params.id;
  if (request.params.id) {
    models.User.findById(userId)
    .then((user) => {
      const result = { userID: user.id,
        userRole: user.roleId,
        email: user.email
      };
      response.status(200).json({ result });
    })
    .catch((error) => {
      response.status(404).json({
        message: `cannot find user with ID: ${userId}`,
        error,
      });
    });
  } else {
    response.status(404).json({
      message: 'Validation error!!  No id was passed',
      error: true
    });
  }
};

const updateUser = (request, response) => {
  const userId = request.params.id;
  const isAdmin = RegExp('admin', 'gi').test(request.decoded.data.roleType);
  request.body.roleId = isAdmin ? request.body.roleId :
    request.body.roleId = null;

  if (!isAdmin && userId !== request.decoded.data.userId) {
    return response.status(401).json({
      message: "Only an Admin can update another user's attributes",
      error: 401 });
  }
  models.User.update(request.body, {
    where: {
      id: request.params.id
    },
    returning: true,
    plain: true,
  })
  .then((user) => {
    response.status(200).json({
      message: 'User updated successfully',
      result: user[1].dataValues });
  })
  .catch((error) => {
    response.status(409).json({
      message: 'Could not updating user details, verify the ID is valid',
      error,
    });
  });
};

const deleteUser = (request, response) => {
  const deleteUserId = request.params.id;
  const isAdmin = RegExp('admin', 'gi').test(request.decoded.data.roleType);
  let query;
  if (isAdmin || Number(deleteUserId) === request.decoded.data.userId) {
    query = { where: { id: deleteUserId } };
  } else {
    return response.status(200).json({
      message: `You need Admin priviledges to delete another user's
        account other than yours,`,
      error: true });
  }
  models.User.destroy(query)
  .then((user) => {
    if (user === 0) {
      response.status(404).json({
        message: 'User ID does not exist',
        user });
    } else {
      response.status(200).json({
        message: 'User deleted successfully',
        user });
    }
  })
  .catch((error) => {
    response.status(409).json({
      message: 'An error occured! User could not be deleted',
      error,
    });
  });
};

module.exports = {
  createUser,
  loginUser,
  allUser,
  findUser,
  updateUser,
  deleteUser,
};
