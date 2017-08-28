import faker from 'faker';

const mockData = {

  invalidEmail: { param: 'email',
    msg: 'valid email address is required',
    value: 'johnDoe@yahoo' },

  invalidPassword: { param: 'password',
    msg: '8 or more characters required',
    value: 'Food' },

  userSearchResult: { message: 'users retrieved successfully',
    users:
    [{ id: 1, username: 'framky', roleId: 1 },
     { id: 2, username: 'framky007', roleId: 2 },
     { id: 3, username: 'frank', roleId: 3 }],
    pagination: { page: 1, pageCount: 1, pageSize: 10, totalCount: 3 } },

  docNotFound: 'the Document ID does not exist',

  usersInDatabase: [{ id: 1, username: 'framky', roleId: 1 },
    { id: 2, username: 'framky007', roleId: 2 },
    { id: 4, username: 'johnbull', roleId: 2 },
    { id: 5, username: 'john', roleId: 2 },
    { id: 3, username: 'frank', roleId: 3 }],

  noToken: { error: 'A token is requeired for authentication' },

  invalidToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoiZnJhbWt5Q',

  admin: { id: 1, roleId: 1 },
  regularUser: { id: 2, roleId: 2 },

  invalidTitle: { param: 'title', msg: '3 to 150 characters required' },

  shortTitle: { param: 'title',
    msg: '10 to 150 characters required',
    value: 'history' },

  emptyContent: { param: 'content', msg: 'Document content cannot be empty' },

  newDoc: { title: 'history 211',
    content: 'This is the beginning of history class',
    access: 'public'
  },

  foundUser: { userID: 1, roleId: 1, email: 'ajaps@yahoo.com' },
  allDocuments: [
    { id: 6,
      title: 'history 101',
      content: 'This is the beginning of history class',
      access: 'public',
      userId: 2,
      roleId: 2,
      createdAt: '2017-07-31T09:11:40.419Z',
      updatedAt: '2017-07-31T09:11:40.419Z' },
    { id: 2,
      title: 'Introduction to 102',
      content: 'Who b this fush?',
      access: 'private',
      userId: 2,
      roleId: 2,
      createdAt: '2017-07-31T09:11:37.589Z',
      updatedAt: '2017-07-31T09:11:37.589Z' },
    { id: 4,
      title: 'Introduction to 104',
      content: 'Who b this tortoise?',
      access: 'role',
      userId: 4,
      roleId: 2,
      createdAt: '2017-07-31T09:11:37.589Z',
      updatedAt: '2017-07-31T09:11:37.589Z' },
    { id: 5,
      title: 'Introduction to 105',
      content: 'Did i do that? did i really do that?',
      access: 'role',
      userId: 2,
      roleId: 2,
      createdAt: '2017-07-31T09:11:37.589Z',
      updatedAt: '2017-07-31T09:11:37.589Z' },
    { id: 1,
      title: 'Introduction to 101',
      content: 'Who b this goat?',
      access: 'public',
      userId: 1,
      roleId: 1,
      createdAt: '2017-07-31T09:11:37.588Z',
      updatedAt: '2017-07-31T09:11:37.588Z' }
  ],

  getDocsById: [{ id: 6,
    title: 'history 211',
    content: 'This is the beginning of history class',
    access: 'public',
    userId: 2,
    roleId: 2,
    createdAt: '2017-07-31T13:34:15.303Z',
    updatedAt: '2017-07-31T13:34:15.303Z' }],

  foundUsers: { id: 1, email: 'ajaps@yahoo.com', roleId: 1 },

  invalidAccessType: {
    title: 'history 311',
    content: 'In 1970, before the war broke out; There were rumours',
    access: 'protected',
    userId: 1,
    roleId: 1,
  },

  noTitle: {
    content: 'In 1970, before the war broke out; There were rumours',
    access: 'protected',
    userId: 1,
    roleId: 1,
  },

  invalidAccess: { error: 'An unexpected error occured',
    detailed_error:
    [{ message: 'Must be \'private\', \'public\' or \'role\' ',
      type: 'Validation error',
      path: 'access',
      value: 'protected',
      __raw: {} }],
    more_info: 'https://dmsys.herokuapp.com/#update-document' },

  invalidTitleLength: { param: 'title',
    msg: '3 to 150 characters required',
    value: 'Fo' },

  invalidId: {
    param: 'id',
    msg: 'ID must be a number',
    value: 'frank',
  },

  publicDocument: {
    id: faker.random.number({ max: 100, min: 1 }),
    title: 'public document',
    content: faker.lorem.sentence(),
    access: 'public',
    userId: 2,
    roleId: 2,
  },
  testRole: {
    roleName: 'visitor'
  },
  UserData: {
    id: faker.random.number({ max: 100, min: 1 }),
    first_name: faker.name.firstName(),
    last_name: faker.name.lastName(),
    username: 'regularUser',
    email: 'regular@user.com',
    password: faker.internet.password(),
    role_id: 2
  },
};


export default mockData;
