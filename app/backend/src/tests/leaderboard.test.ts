import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import App from '../app';
import TeamsModel from '../database/models/TeamsModel';
import MatchesModel from '../database/models/MatchesModel';

import { Response } from 'superagent';
import { 
  avaiAwayTeamMatchesMock,
  avaiHomeTeamMatchesMock,
  bahiaAwayTeamMatchesMock,
  bahiaHomeTeamMatchesMock,
} from './mocks/matchesMock';
import {
  allLeaderboardMock,
  awayLeaderboardMock,
  homeLeaderboardMock,
} from './mocks/leaderboardMock';
import { shortTeamListMock } from './mocks/teamsMock';

chai.use(chaiHttp);

const { app } = new App();

const { expect } = chai;

describe('integration tests for /leaderboard routes', () => {
  let chaiHttpResponse: Response;

  beforeEach(async () => {
    sinon.stub(TeamsModel, 'findAll').resolves(shortTeamListMock as TeamsModel[]);
  });

  afterEach(() => {
    (TeamsModel.findAll as sinon.SinonStub).restore();

    (MatchesModel.findAll as sinon.SinonStub).restore();
  });

  it('tests a successful return from GET request of home teams leaderboard', async () => {
    sinon.stub(MatchesModel, 'findAll')
      .onFirstCall().resolves(avaiHomeTeamMatchesMock as MatchesModel[])
      .onSecondCall().resolves(bahiaHomeTeamMatchesMock as MatchesModel[]);

    chaiHttpResponse = await chai.request(app).get('/leaderboard/home');

    expect(chaiHttpResponse.status).to.be.equal(200);
    expect(chaiHttpResponse.body).to.be.deep.equal(homeLeaderboardMock);
  });

  it('tests a successful return from GET request of away teams leaderboard', async () => {
    sinon.stub(MatchesModel, 'findAll')
      .onFirstCall().resolves(avaiAwayTeamMatchesMock as MatchesModel[])
      .onSecondCall().resolves(bahiaAwayTeamMatchesMock as MatchesModel[]);

    chaiHttpResponse = await chai.request(app).get('/leaderboard/away');

    expect(chaiHttpResponse.status).to.be.equal(200);
    expect(chaiHttpResponse.body).to.be.deep.equal(awayLeaderboardMock);
  });

  it('tests a successful return from GET request of all leaderboard', async () => {
    sinon.stub(MatchesModel, 'findAll')
      .onCall(0).resolves(avaiHomeTeamMatchesMock as MatchesModel[])
      .onCall(1).resolves(bahiaHomeTeamMatchesMock as MatchesModel[])
      .onCall(2).resolves(avaiAwayTeamMatchesMock as MatchesModel[])
      .onCall(3).resolves(bahiaAwayTeamMatchesMock as MatchesModel[]);

    chaiHttpResponse = await chai.request(app).get('/leaderboard');

    expect(chaiHttpResponse.status).to.be.equal(200);
    expect(chaiHttpResponse.body).to.be.deep.equal(allLeaderboardMock);
  });
});
