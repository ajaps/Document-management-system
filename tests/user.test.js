import chai from 'chai';
import supertest from 'supertest';
import authentication from '../server/middleware/authentication';
import mockData from './mockData/mockData';
import server from '../server';

const expect = chai.expect;
const request = supertest(server);
let regularToken;
const adminToken = authentication.setUserToken(mockData.admin);

describe('When user', () => {
  describe('signs up', () => {
    it('should return a JSON object containing message and a token', (done) => {
      request.post('/api/v1/users')
    .send({ email: 'johnDoe@yahoo.com', password: 'humanity', username: 'john' })
    .end((err, res) => {
      regularToken = res.body.token;
      expect(res.body.message).to.be.equal('New user created successfully');
      expect(regularToken).to.have.lengthOf.above(20);
      expect(res.statusCode).to.be.equal(201);
      done();
    });
    });

    it(`should return "johnDoe@yahoo.com already exist" and status 409,
      when user tries to signup with an existing email`, (done) => {
      request.post('/api/v1/users')
    .send({ email: 'johnDoe@yahoo.com', password: 'goodFood', username: 'joh' })
    .end((err, res) => {
      expect(res.body.message).to.be.equal('johnDoe@yahoo.com already exist');
      expect((res.body.token)).to.be.a('null');
      expect(res.statusCode).to.be.equal(409);
      done();
    });
    });

    it(`should return a json object with param and msg,
      when user tries to signup without a valid email`, (done) => {
      request.post('/api/v1/users')
    .send({ email: 'johnDoe@yahoo', password: 'goodFood', username: 'joh' })
    .end((err, res) => {
      expect(res.body.message.email).to.eql(mockData.invalidEmail);
      expect(res.statusCode).to.be.equal(412);
      done();
    });
    });

    it(`should return a json object with param and msg,
      when user tries to signup
      without a password greater than 8 characters`, (done) => {
      request.post('/api/v1/users')
    .send({ email: 'johnDoe@yahoo.com', password: 'Food', username: 'joh' })
    .end((err, res) => {
      expect(res.body.message.password).to.eql(mockData.invalidPassword);
      expect(res.statusCode).to.be.equal(412);
      done();
    });
    });
  });

  describe('logs In', () => {
    it('should return a JSON object containing message and a token', (done) => {
      request.post('/api/v1/users/login')
    .send({ email: 'johnDoe@yahoo.com', password: 'humanity' })
    .end((err, res) => {
      expect(res.body.message).to.be.equal('Logged in successfully');
      expect(res.body.token).to.have.lengthOf.above(20);
      expect(res.statusCode).to.be.equal(202);
      done();
    });
    });

    it(`should return "Invalid email or password" and status 404,
      when user tries to log in with a wrong password`, (done) => {
      request.post('/api/v1/users/login')
    .send({ email: 'johnDoe@yahoo.com', password: 'loveGoodFood' })
    .end((err, res) => {
      expect(res.body.message).to.be.equal('Invalid email or password');
      expect((res.body.token)).to.be.a('null');
      expect(res.statusCode).to.be.equal(401);
      done();
    });
    });

    it(`should return a json object with token set to null,
      when user tries to login email not in the database`, (done) => {
      request.post('/api/v1/users/login')
    .send({ email: 'frank@gmail.com', password: 'humanity' })
    .end((err, res) => {
      expect(res.body.message).to.be.equal('frank@gmail.com does not exist in the database');
      expect(res.statusCode).to.be.equal(404);
      done();
    });
    });
  });

  describe('finds matching instances of user', () => {
    it('should return a all users', (done) => {
      request.get('/api/v1/users')
    .set({ Authorization: regularToken })
    .set('Accept', 'application/json')
    .end((err, res) => {
      expect(res.body.totalCount).to.be.equal(5);
      expect(res.body.users).to.eql(mockData.usersInDatabase);
      expect(res.statusCode).to.be.equal(200);
      done();
    });
    });
    it("should return 'Invalid token' and status 401 if an invalid token is used"
    , (done) => {
      request.get('/api/v1/users')
    .set({ Authorization: mockData.invalidToken })
    .set('Accept', 'application/json')
    .end((err, res) => {
      expect(res.body.message).to.be.equal('Invalid token');
      expect(res.statusCode).to.be.equal(401);
      done();
    });
    });
    it(`should return "A token is requeired for authentication" and status 428,
      when token isn't provided`, (done) => {
      request.get('/api/v1/users')
    .end((err, res) => {
      expect(res.body).to.be.eql(mockData.noToken);
      expect((res.body.token)).to.be.a('undefined');
      expect(res.statusCode).to.be.equal(428);
      done();
    });
    });
  });

  describe('search for users by ID', () => {
    it('should return status code 412 if userID is not specified', (done) => {
      request.get('/api/v1/users/fr')
    .set({ Authorization: regularToken })
    .set('Accept', 'application/json')
    .end((err, res) => {
      expect(res.body.message.id.msg).to.be.equal('ID must be a number');
      expect(res.statusCode).to.be.equal(412);
      done();
    });
    });
    it(`should return a JSON object containing the users'
      attributes if the ID exist`, (done) => {
      request.get('/api/v1/users/1')
      .set('Accept', 'application/json')
    .set({ Authorization: regularToken })
    .end((err, res) => {
      expect(res.body.user).to.be.an('array');
      expect(res.statusCode).to.be.equal(200);
      done();
    });
    });

    it('should return a JSON object message: userId not found', (done) => {
      request.get('/api/v1/users/100')
      .set('Accept', 'application/json')
    .set({ Authorization: regularToken })
    .end((err, res) => {
      expect(res.body.message).to.be.equal('userId not found');
      expect(res.statusCode).to.be.equal(404);
      done();
    });
    });
  });

  describe('update user attributes', () => {
    it(`should return a status code 404,
      when user(not Admin) tries to update another users attributes`, (done) => {
      request.put('/api/v1/users/3')
    .set({ Authorization: regularToken })
    .set('Accept', 'application/json')
    .send({ email: 'frank@gmail.com', password: 'humanity', roleId: 1 })
    .end((err, res) => {
      expect(res.body.message).to.be
      .equal("Only an Admin can update another user's attributes");
      expect(res.statusCode).to.be.equal(401);
      done();
    });
    });

    it(`should return a status code 200,
      when Admin update another users attributes`, (done) => {
      request.put('/api/v1/users/3')
    .set({ Authorization: adminToken })
    .set('Accept', 'application/json')
    .send({ email: 'frank007@gmail.com', password: 'humanity', roleId: 3 })
    .end((err, res) => {
      expect(res.body.message).to.be.equal('User updated successfully');
      expect(res.statusCode).to.be.equal(200);
      done();
    });
    });
  });

  describe('delete user attributes', () => {
    it(`should return a status code 401, when the user who does not have Admin
      rights tries to delete a record other that his `, (done) => {
      request.delete('/api/v1/users/1')
    .set({ Authorization: regularToken })
    .set('Accept', 'application/json')
    .end((err, res) => {
      expect(res.body.message).to.be
      .equal("Only an Admin can delete another user's record");
      expect(res.statusCode).to.be.equal(401);
      done();
    });
    });
    it(`should return a status code 200, when the user deletes own record or
      user has admin rights to delete any record`, (done) => {
      request.delete('/api/v1/users/5')
    .set({ Authorization: regularToken })
    .set('Accept', 'application/json')
    .end((err, res) => {
      expect(res.body.message).to.be
      .equal('User deleted successfully');
      expect(res.statusCode).to.be.equal(200);
      done();
    });
    });
    it(`should return a status code 404,
      when the user deletes a record that does not exist`, (done) => {
      request.delete('/api/v1/users/10')
    .set({ Authorization: adminToken })
    .set('Accept', 'application/json')
    .end((err, res) => {
      expect(res.body.message).to.be
      .equal('User ID does not exist');
      expect(res.statusCode).to.be.equal(404);
      done();
    });
    });
  });
});
