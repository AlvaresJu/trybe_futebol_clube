import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import App from '../app';
import TeamsModel from '../database/models/TeamsModel';
import MatchesModel from '../database/models/MatchesModel';

import { Response } from 'superagent';

chai.use(chaiHttp);

const { app } = new App();

const { expect } = chai;

describe('integration tests for /leaderboard routes', () => {
  let chaiHttpResponse: Response;
  const teamListMock = [
    { id: 1, teamName: "Avaí/Kindermann" },
    { id: 2, teamName: "Bahia" },
  ];

  const avaiHomeTeamMatchesMock = [
    {
      id: 9,
      homeTeam: 1,
      homeTeamGoals: 0,
      awayTeam: 12,
      awayTeamGoals: 3,
      inProgress: false,
    },
    {
      id: 17,
      homeTeam: 1,
      homeTeamGoals: 2,
      awayTeam: 8,
      awayTeamGoals: 3,
      inProgress: false,
    },
    {
      id: 33,
      homeTeam: 1,
      homeTeamGoals: 1,
      awayTeam: 16,
      awayTeamGoals: 1,
      inProgress: false,
    },
  ];
  const bahiaHomeTeamMatchesMock = [
    {
      id: 10,
      homeTeam: 2,
      homeTeamGoals: 0,
      awayTeam: 9,
      awayTeamGoals: 2,
      inProgress: false,
    },
    {
      id: 25,
      homeTeam: 2,
      homeTeamGoals: 0,
      awayTeam: 6,
      awayTeamGoals: 1,
      inProgress: false,
    },
    {
      id: 36,
      homeTeam: 2,
      homeTeamGoals: 0,
      awayTeam: 7,
      awayTeamGoals: 1,
      inProgress: false,
    },
  ];
  
  const avaiAwayTeamMatchesMock = [
    {
      id: 8,
      homeTeam: 15,
      homeTeamGoals: 0,
      awayTeam: 1,
      awayTeamGoals: 1,
      inProgress: false,
    },
    {
      id: 26,
      homeTeam: 13,
      homeTeamGoals: 1,
      awayTeam: 1,
      awayTeamGoals: 0,
      inProgress: false,
    },
  ];
  const bahiaAwayTeamMatchesMock = [
    {
      id: 4,
      homeTeam: 3,
      homeTeamGoals: 0,
      awayTeam: 2,
      awayTeamGoals: 0,
      inProgress: false,
    },
    {
      id: 19,
      homeTeam: 11,
      homeTeamGoals: 2,
      awayTeam: 2,
      awayTeamGoals: 2,
      inProgress: false,
    },
  ];
  
  const homeLeaderboardMock = [
    {
      name: 'Avaí/Kindermann',
      totalPoints: 1,
      totalGames: 3,
      totalVictories: 0,
      totalDraws: 1,
      totalLosses: 2,
      goalsFavor: 3,
      goalsOwn: 7,
      goalsBalance: -4,
      efficiency: '11.11',
    },
    {
      name: 'Bahia',
      totalPoints: 0,
      totalGames: 3,
      totalVictories: 0,
      totalDraws: 0,
      totalLosses: 3,
      goalsFavor: 0,
      goalsOwn: 4,
      goalsBalance: -4,
      efficiency: '0.00',
    },
  ];
  const awayLeaderboardMock = [
    {
      name: 'Avaí/Kindermann',
      totalPoints: 3,
      totalGames: 2,
      totalVictories: 1,
      totalDraws: 0,
      totalLosses: 1,
      goalsFavor: 1,
      goalsOwn: 1,
      goalsBalance: 0,
      efficiency: '50.00',
    },
    {
      name: 'Bahia',
      totalPoints: 2,
      totalGames: 2,
      totalVictories: 0,
      totalDraws: 2,
      totalLosses: 0,
      goalsFavor: 2,
      goalsOwn: 2,
      goalsBalance: 0,
      efficiency: '33.33',
    },
  ];


  beforeEach(async () => {
    sinon.stub(TeamsModel, 'findAll').resolves(teamListMock as TeamsModel[]);
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
});
