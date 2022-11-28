import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import App from '../app';

import { Response } from 'superagent';
import MatchesModel from '../database/models/MatchesModel';
import TeamsModel from '../database/models/TeamsModel';

chai.use(chaiHttp);

const { app } = new App();

const { expect } = chai;

describe('integration tests for POST /matches route', () => {
  let chaiHttpResponse: Response;

  const matchMock = {
    id: 1,
    homeTeam: 16,
    homeTeamGoals: 2,
    awayTeam: 8,
    awayTeamGoals: 2,
    inProgress: true,
  };
  const homeTeamMock = {
    id: 16,
    teamName: 'São Paulo',
  };
  const awayTeamMock = {
    id: 8,
    teamName: 'Grêmio',
  };

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
      .set('authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywidXNlcm5hbWUiOiJUZXN0ZSIsImlhdCI6MTY2OTIyNDgyOCwiZXhwIjoxNjY5ODI5NjI4fQ.cdxH1f-RRgYNomeH--e7tIpWr3CMVP7MEG0R3OA2eyw')
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
      .set('authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywidXNlcm5hbWUiOiJUZXN0ZSIsImlhdCI6MTY2OTIyNDgyOCwiZXhwIjoxNjY5ODI5NjI4fQ.cdxH1f-RRgYNomeH--e7tIpWr3CMVP7MEG0R3OA2eyw')
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
      .set('authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywidXNlcm5hbWUiOiJUZXN0ZSIsImlhdCI6MTY2OTIyNDgyOCwiZXhwIjoxNjY5ODI5NjI4fQ.cdxH1f-RRgYNomeH--e7tIpWr3CMVP7MEG0R3OA2eyw')
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
      .set('authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywidXNlcm5hbWUiOiJUZXN0ZSIsImlhdCI6MTY2OTIyNDgyOCwiZXhwIjoxNjY5ODI5NjI4fQ.cdxH1f-RRgYNomeH--e7tIpWr3CMVP7MEG0R3OA2eyw')
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
      .set('authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywidXNlcm5hbWUiOiJUZXN0ZSIsImlhdCI6MTY2OTIyNDgyOCwiZXhwIjoxNjY5ODI5NjI4fQ.cdxH1f-RRgYNomeH--e7tIpWr3CMVP7MEG0R3OA2eyw')
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
      .set('authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywidXNlcm5hbWUiOiJUZXN0ZSIsImlhdCI6MTY2OTIyNDgyOCwiZXhwIjoxNjY5ODI5NjI4fQ.cdxH1f-RRgYNomeH--e7tIpWr3CMVP7MEG0R3OA2eyw')
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
      .set('authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywidXNlcm5hbWUiOiJUZXN0ZSIsImlhdCI6MTY2OTIyNDgyOCwiZXhwIjoxNjY5ODI5NjI4fQ.cdxH1f-RRgYNomeH--e7tIpWr3CMVP7MEG0R3OA2eyw')
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
      .set('authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywidXNlcm5hbWUiOiJUZXN0ZSIsImlhdCI6MTY2OTIyNDgyOCwiZXhwIjoxNjY5ODI5NjI4fQ.cdxH1f-RRgYNomeH--e7tIpWr3CMVP7MEG0R3OA2eyw')
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
      .set('authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywidXNlcm5hbWUiOiJUZXN0ZSIsImlhdCI6MTY2OTIyNDgyOCwiZXhwIjoxNjY5ODI5NjI4fQ.cdxH1f-RRgYNomeH--e7tIpWr3CMVP7MEG0R3OA2eyw')
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
      .set('authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywidXNlcm5hbWUiOiJUZXN0ZSIsImlhdCI6MTY2OTIyNDgyOCwiZXhwIjoxNjY5ODI5NjI4fQ.cdxH1f-RRgYNomeH--e7tIpWr3CMVP7MEG0R3OA2eyw')
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
      .set('authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywidXNlcm5hbWUiOiJUZXN0ZSIsImlhdCI6MTY2OTIyNDgyOCwiZXhwIjoxNjY5ODI5NjI4fQ.cdxH1f-RRgYNomeH--e7tIpWr3CMVP7MEG0R3OA2eyw')
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
      .set('authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywidXNlcm5hbWUiOiJUZXN0ZSIsImlhdCI6MTY2OTIyNDgyOCwiZXhwIjoxNjY5ODI5NjI4fQ.cdxH1f-RRgYNomeH--e7tIpWr3CMVP7MEG0R3OA2eyw')
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
