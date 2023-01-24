import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');
import { app } from '../app';
import { Response } from 'superagent';
import UsersModel from '../database/models/usersModel';
import { mock } from './mocks/LoginMock';

chai.use(chaiHttp);
const tokenMock = {
  token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjc0MzA4NTQ5fQ.oEaGiJBRFsgBdfPhGRz-PHnQYd4Pd9Nj0AvUv0-LjwM",
 };
const mockSucess = mock;
const { expect } = chai;
describe('Login tests.', () => {
  let response: Response;

   before(async () => {
      sinon
       .stub(UsersModel, 'findOne')
       .resolves(mockSucess as unknown as UsersModel);
   });

   after(()=>{
     (UsersModel.findOne as sinon.SinonStub).restore();
   });

  it('Test without email field.', async () => {
    response = await chai
      .request(app).post('/login')
      .send({
        password: 'test2',
      });
      expect(response.body).to.deep.equal({ message: "All fields must be filled" });
  });

  it('Test the email field filled in wrong.', async () => {
    response = await chai
      .request(app).post('/login')
      .send({
        email: 'test2',
        password: 'test123',
      });
      expect(response.body).to.deep.equal({ message: "Incorrect email or password" });
  });

  it('Test without password field.', async () => {
    response = await chai
      .request(app).post('/login')
      .send({
        email: 'test@test.com',
      });
      expect(response.body).to.deep.equal({ message: "All fields must be filled" });
  });

  it('Test the wrong password field.', async () => {
    response = await chai
      .request(app).post('/login')
      .send({
        email: 'test@test.com',
        password: 'test2',
      });
      expect(response.body).to.deep.equal({ message: "Incorrect email or password" });
  });

  it('Test without filling in the fields.', async () => {
    response = await chai
      .request(app).post('/login')
      .send({
        email: '',
        password: '',
      });
      expect(response.body).to.deep.equal({ message: "All fields must be filled" });
  });

  it('Tests fields filled incorrect, without return.', async () => {
    response = await chai
      .request(app).post('/login')
      .send({
        email: 'test@test.com',
        password: 'test2'
      });
      expect(response.body).to.deep.equal({ message: 'Incorrect email or password' });
  });

  it('Test with correct token.', async () => {
    response = await chai
      .request(app).get('/login/validate')
      .set('Authorization', tokenMock.token);
      expect(response.body).to.deep.equal({ role: 'test' });
  });

  it('Test with wrong token.', async () => {
    response = await chai
      .request(app).get('/login/validate')
      .send({ token: 'test2'});
      expect(response.body).to.deep.equal({ message: 'não autorizado.' });
  });

  it('Test without token.', async () => {
    response = await chai
      .request(app).get('/login/validate')
      .send({});
      expect(response.body).to.deep.equal({ message: 'não autorizado.' });
  });
});
