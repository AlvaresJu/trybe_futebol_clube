import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import App from '../app';

import { Response } from 'superagent';
import MatchesModel from '../database/models/MatchesModel';
import TeamsModel from '../database/models/TeamsModel';
import { awayTeamMock, homeTeamMock, matchMock } from './mocks/matchesMock';

chai.use(chaiHttp);

const { app } = new App();

const { expect } = chai;

describe('integration tests for POST /matches route', () => {
  let chaiHttpResponse: Response;

  beforeEach(() => {
    sinon.stub(TeamsModel, 'findOne')
      .onFirstCall().resolves(homeTeamMock as TeamsModel)
      .onSecondCall().resolves(awayTeamMock as TeamsModel);

    sinon.stub(MatchesModel, 'create')
      .resolves(matchMock as MatchesModel);
  });

  afterEach(() => {
    (TeamsModel.findOne as sinon.SinonStub).restore();

    (MatchesModel.create as sinon.SinonStub).restore();
  });

  it('tests a successful save of a new match', async () => {
    chaiHttpResponse = await chai
      .request(app)
      .post('/matches')
      .set('authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwidXNlcm5hbWUiOiJVc2VyIiwiaWF0IjoxNjgyNTM1MzA2LCJleHAiOjE2OTI5MDMzMDZ9.jq_X8oTW1ngPF_uGw17IIFtk8rmm33h0fY9GURpMZ0Q')
      .send({
        homeTeam: 16,
        homeTeamGoals: 2,
        awayTeam: 8,
        awayTeamGoals: 2,
      });
    
    expect(chaiHttpResponse.status).to.be.equal(201);
    expect(chaiHttpResponse.body).to.be.deep.equal(matchMock);
  });

  it('tests an attempt to save a new match without authorization token', async () => {
    chaiHttpResponse = await chai.request(app).post('/matches');

    expect(chaiHttpResponse.status).to.be.equal(401);
    expect(chaiHttpResponse.body).to.be.deep.equal({
      message: 'Token not found',
    });
  });

  it('tests an attempt to save a new match with an invalid authorization token', async () => {
    chaiHttpResponse = await chai
      .request(app).post('/matches')
      .set('authorization', 'invalidToken');

    expect(chaiHttpResponse.status).to.be.equal(401);
    expect(chaiHttpResponse.body).to.be.deep.equal({
      message: 'Token must be a valid token',
    });
  });

  it('tests an attempt to save a new match without "homeTeam" information', async () => {
    chaiHttpResponse = await chai
      .request(app).post('/matches')
      .set('authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJBZG1pbiIsImlhdCI6MTY3NjAwODA2MCwiZXhwIjoxNjg2Mzc2MDYwfQ.BNcBgdAx_Q-jPkQHL_E_mgUE4TGuNMPxI-XTxG0sIB8')
      .send({
        homeTeamGoals: 2,
        awayTeam: 8,
        awayTeamGoals: 2,
      });

    expect(chaiHttpResponse.status).to.be.equal(400);
    expect(chaiHttpResponse.body).to.be.deep.equal({
      message: '"homeTeam" is required',
    });
  });

  it('tests an attempt to save a new match with invalid "homeTeam" information (not a number)', async () => {
    chaiHttpResponse = await chai
      .request(app).post('/matches')
      .set('authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJBZG1pbiIsImlhdCI6MTY3NjAwODA2MCwiZXhwIjoxNjg2Mzc2MDYwfQ.BNcBgdAx_Q-jPkQHL_E_mgUE4TGuNMPxI-XTxG0sIB8')
      .send({
        homeTeam: '16',
        homeTeamGoals: 2,
        awayTeam: 8,
        awayTeamGoals: 2,
      });

    expect(chaiHttpResponse.status).to.be.equal(400);
    expect(chaiHttpResponse.body).to.be.deep.equal({
      message: '"homeTeam" must be a number',
    });
  });

  it('tests an attempt to save a new match with invalid "awayTeam" information (not an integer)', async () => {
    chaiHttpResponse = await chai
      .request(app).post('/matches')
      .set('authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJBZG1pbiIsImlhdCI6MTY3NjAwODA2MCwiZXhwIjoxNjg2Mzc2MDYwfQ.BNcBgdAx_Q-jPkQHL_E_mgUE4TGuNMPxI-XTxG0sIB8')
      .send({
        homeTeam: 16,
        homeTeamGoals: 2,
        awayTeam: 8.5,
        awayTeamGoals: 2,
      });

    expect(chaiHttpResponse.status).to.be.equal(400);
    expect(chaiHttpResponse.body).to.be.deep.equal({
      message: '"awayTeam" must be an integer',
    });
  });

  it('tests an attempt to save a new match with invalid "awayTeam" information (lass than 1)', async () => {
    chaiHttpResponse = await chai
      .request(app).post('/matches')
      .set('authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJBZG1pbiIsImlhdCI6MTY3NjAwODA2MCwiZXhwIjoxNjg2Mzc2MDYwfQ.BNcBgdAx_Q-jPkQHL_E_mgUE4TGuNMPxI-XTxG0sIB8')
      .send({
        homeTeam: 16,
        homeTeamGoals: 2,
        awayTeam: 0,
        awayTeamGoals: 2,
      });

    expect(chaiHttpResponse.status).to.be.equal(400);
    expect(chaiHttpResponse.body).to.be.deep.equal({
      message: '"awayTeam" must be greater than or equal to 1',
    });
  });

  it('tests an attempt to save a new match with invalid "homeTeamGoals" information (not an integer)', async () => {
    chaiHttpResponse = await chai
      .request(app).post('/matches')
      .set('authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJBZG1pbiIsImlhdCI6MTY3NjAwODA2MCwiZXhwIjoxNjg2Mzc2MDYwfQ.BNcBgdAx_Q-jPkQHL_E_mgUE4TGuNMPxI-XTxG0sIB8')
      .send({
        homeTeam: 16,
        homeTeamGoals: 2.7,
        awayTeam: 8,
        awayTeamGoals: 2,
      });

    expect(chaiHttpResponse.status).to.be.equal(400);
    expect(chaiHttpResponse.body).to.be.deep.equal({
      message: '"homeTeamGoals" must be an integer',
    });
  });

  it('tests an attempt to save a new match with invalid "homeTeamGoals" information (lass than 0)', async () => {
    chaiHttpResponse = await chai
      .request(app).post('/matches')
      .set('authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJBZG1pbiIsImlhdCI6MTY3NjAwODA2MCwiZXhwIjoxNjg2Mzc2MDYwfQ.BNcBgdAx_Q-jPkQHL_E_mgUE4TGuNMPxI-XTxG0sIB8')
      .send({
        homeTeam: 16,
        homeTeamGoals: -5,
        awayTeam: 8,
        awayTeamGoals: 2,
      });

    expect(chaiHttpResponse.status).to.be.equal(400);
    expect(chaiHttpResponse.body).to.be.deep.equal({
      message: '"homeTeamGoals" must be greater than or equal to 0',
    });
  });

  it('tests an attempt to save a new match without "awayTeamGoals" information', async () => {
    chaiHttpResponse = await chai
      .request(app).post('/matches')
      .set('authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJBZG1pbiIsImlhdCI6MTY3NjAwODA2MCwiZXhwIjoxNjg2Mzc2MDYwfQ.BNcBgdAx_Q-jPkQHL_E_mgUE4TGuNMPxI-XTxG0sIB8')
      .send({
        homeTeam: 16,
        homeTeamGoals: 2,
        awayTeam: 8,
      });

    expect(chaiHttpResponse.status).to.be.equal(400);
    expect(chaiHttpResponse.body).to.be.deep.equal({
      message: '"awayTeamGoals" is required',
    });
  });

  it('tests an attempt to save a new match with invalid "awayTeamGoals" information (not a number)', async () => {
    chaiHttpResponse = await chai
      .request(app).post('/matches')
      .set('authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJBZG1pbiIsImlhdCI6MTY3NjAwODA2MCwiZXhwIjoxNjg2Mzc2MDYwfQ.BNcBgdAx_Q-jPkQHL_E_mgUE4TGuNMPxI-XTxG0sIB8')
      .send({
        homeTeam: 16,
        homeTeamGoals: 2,
        awayTeam: 8,
        awayTeamGoals: 'test',
      });

    expect(chaiHttpResponse.status).to.be.equal(400);
    expect(chaiHttpResponse.body).to.be.deep.equal({
      message: '"awayTeamGoals" must be a number',
    });
  });

  it('tests an attempt to save a new match with the same "homeTeam" and "awayTeam"', async () => {
    chaiHttpResponse = await chai
      .request(app).post('/matches')
      .set('authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJBZG1pbiIsImlhdCI6MTY3NjAwODA2MCwiZXhwIjoxNjg2Mzc2MDYwfQ.BNcBgdAx_Q-jPkQHL_E_mgUE4TGuNMPxI-XTxG0sIB8')
      .send({
        homeTeam: 8,
        homeTeamGoals: 2,
        awayTeam: 8,
        awayTeamGoals: 2,
      });

    expect(chaiHttpResponse.status).to.be.equal(422);
    expect(chaiHttpResponse.body).to.be.deep.equal({
      message: 'It is not possible to create a match with two equal teams',
    });
  });

  it('tests an attempt to save a new match with non-existent "homeTeam"', async () => {
    (TeamsModel.findOne as sinon.SinonStub).restore();
    sinon.stub(TeamsModel, 'findOne')
    .onFirstCall().resolves(undefined)
    .onSecondCall().resolves(awayTeamMock as TeamsModel);

    chaiHttpResponse = await chai
      .request(app).post('/matches')
      .set('authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJBZG1pbiIsImlhdCI6MTY3NjAwODA2MCwiZXhwIjoxNjg2Mzc2MDYwfQ.BNcBgdAx_Q-jPkQHL_E_mgUE4TGuNMPxI-XTxG0sIB8')
      .send({
        homeTeam: 99,
        homeTeamGoals: 2,
        awayTeam: 8,
        awayTeamGoals: 2,
      });

    expect(chaiHttpResponse.status).to.be.equal(404);
    expect(chaiHttpResponse.body).to.be.deep.equal({
      message: 'There is no team with such id!',
    });
  });

  it('tests an attempt to save a new match with non-existent "awayTeam"', async () => {
    (TeamsModel.findOne as sinon.SinonStub).restore();
    sinon.stub(TeamsModel, 'findOne')
    .onFirstCall().resolves(homeTeamMock as TeamsModel)
    .onSecondCall().resolves(undefined);

    chaiHttpResponse = await chai
      .request(app).post('/matches')
      .set('authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJBZG1pbiIsImlhdCI6MTY3NjAwODA2MCwiZXhwIjoxNjg2Mzc2MDYwfQ.BNcBgdAx_Q-jPkQHL_E_mgUE4TGuNMPxI-XTxG0sIB8')
      .send({
        homeTeam: 16,
        homeTeamGoals: 2,
        awayTeam: 959,
        awayTeamGoals: 2,
      });

    expect(chaiHttpResponse.status).to.be.equal(404);
    expect(chaiHttpResponse.body).to.be.deep.equal({
      message: 'There is no team with such id!',
    });
  });
});
