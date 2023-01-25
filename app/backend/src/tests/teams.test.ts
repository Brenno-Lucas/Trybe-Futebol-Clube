import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');
import { app } from '../app';
import { Response } from 'superagent';
import { AllTeams, Team } from './mocks/teamsMock';
import TeamsModel from '../database/models/teamsModel';

chai.use(chaiHttp);
const { expect } = chai;

describe('Teams Tests ', () => {
  let response: Response;

   before(async () => {
      sinon
       .stub(TeamsModel, 'findAll')
       .resolves(AllTeams as unknown as TeamsModel[]);
      sinon
       .stub(TeamsModel, 'findOne')
       .resolves(Team as unknown as TeamsModel);
   });

   after(()=>{
      (TeamsModel.findAll as sinon.SinonStub).restore();
      (TeamsModel.findOne as sinon.SinonStub).restore();
   });

  it('Test the return of "/teams"', async () => {
    response = await chai
      .request(app).get('/teams')
      .send();
      expect(response.body.length).to.be.equal(16);
  });

  it('Tests the return of "/teams/id", with correct id', async () => {
    response = await chai
      .request(app).get('/teams/14')
      .send();
      expect(response.body).to.be.deep.equal(Team);
  });

  it('Tests the return of "/teams/id", with incorrect id', async () => {
    response = await chai
      .request(app).get('/teams/90')
      .send();
      expect(response.body).to.be.deep.equal({ message: {} });
  });
});