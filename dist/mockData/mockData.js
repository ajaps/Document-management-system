'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var mockData = {
  invalidEmail: { param: 'email',
    msg: 'valid email address is required',
    value: 'johnDoe@yahoo' },

  invalidPassword: { param: 'password',
    msg: '8 or more characters required',
    value: 'Food' },

  usersInDatabase: [{ id: 1, email: 'ajaps@yahoo.com', roleId: 1 }, { id: 2, email: 'ajaps1@yahoo.com', roleId: 2 }, { id: 4, email: 'framky0071@yahoo.com', roleId: 2 }, { id: 5, email: 'johnDoe@yahoo.com', roleId: 2 }, { id: 3, email: 'framky007@yahoo.com', roleId: 3 }],

  noToken: 'A token is requeired for authentication',

  invalidToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoiZnJhbWt5Q',

  admin: { userId: 1, email: 'ajaps@yahoo.com', roleId: 1 },
  regularUser: { userId: 2, email: 'johnDoe@yahoo.com', roleId: 2 },

  invalidTitle: { param: 'title',
    msg: '10 to 20 characters required'
  },

  shortTitle: { param: 'title',
    msg: '10 to 20 characters required',
    value: 'history'
  },

  emptyContent: { param: 'content',
    msg: 'Document content cannot be empty'
  },

  newDoc: { title: 'history 211',
    content: 'This is the beginning of history class',
    access: 'public'
  },
  createdDoc: { message: 'New Document created successfully',
    title: 'history 211',
    ownerId: 2
  },
  foundUser: { userID: 1, roleId: 1, email: 'ajaps@yahoo.com' },
  allDocuments: [{ id: 6,
    title: 'history 101',
    content: 'This is the beginning of history class',
    access: 'public',
    userId: 2,
    roleId: 2,
    createdAt: '2017-07-31T09:11:40.419Z',
    updatedAt: '2017-07-31T09:11:40.419Z' }, { id: 2,
    title: 'Introduction to 102',
    content: 'Who b this fush?',
    access: 'private',
    userId: 2,
    roleId: 2,
    createdAt: '2017-07-31T09:11:37.589Z',
    updatedAt: '2017-07-31T09:11:37.589Z' }, { id: 4,
    title: 'Introduction to 104',
    content: 'Who b this tortoise?',
    access: 'role',
    userId: 4,
    roleId: 2,
    createdAt: '2017-07-31T09:11:37.589Z',
    updatedAt: '2017-07-31T09:11:37.589Z' }, { id: 5,
    title: 'Introduction to 105',
    content: 'Did i do that? did i really do that?',
    access: 'role',
    userId: 2,
    roleId: 2,
    createdAt: '2017-07-31T09:11:37.589Z',
    updatedAt: '2017-07-31T09:11:37.589Z' }, { id: 1,
    title: 'Introduction to 101',
    content: 'Who b this goat?',
    access: 'public',
    userId: 1,
    roleId: 1,
    createdAt: '2017-07-31T09:11:37.588Z',
    updatedAt: '2017-07-31T09:11:37.588Z' }],

  getDocsById: [{ id: 6,
    title: 'history 211',
    content: 'This is the beginning of history class',
    access: 'public',
    userId: 2,
    roleId: 2,
    createdAt: '2017-07-31T13:34:15.303Z',
    updatedAt: '2017-07-31T13:34:15.303Z' }],

  foundUsers: { id: 1, email: 'ajaps@yahoo.com', roleId: 1 }
};

exports.default = mockData;