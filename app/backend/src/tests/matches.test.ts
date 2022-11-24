import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import App from '../app';

import { Response } from 'superagent';
import Matches from '../database/models/MatchesModel';

chai.use(chaiHttp);

const { app } = new App();

const { expect } = chai;

describe('integration tests for /matches route', () => {
  let chaiHttpResponse: Response;
  const matcheListMock = [
    {
      id: 1,
      homeTeam: 16,
      homeTeamGoals: 1,
      awayTeam: 8,
      awayTeamGoals: 1,
      inProgress: false,
      teamHome: {
        teamName: 'São Paulo'
      },
      teamAway: {
        teamName: 'Grêmio'
      }
    },
    {
      id: 2,
      homeTeam: 9,
      homeTeamGoals: 1,
      awayTeam: 14,
      awayTeamGoals: 1,
      inProgress: false,
      teamHome: {
        teamName: 'Internacional'
      },
      teamAway: {
        teamName: 'Santos'
      }
    },
    {
      id: 41,
      homeTeam: 16,
      homeTeamGoals: 2,
      awayTeam: 9,
      awayTeamGoals: 0,
      inProgress: true,
      teamHome: {
        teamName: 'São Paulo'
      },
      teamAway: {
        teamName: 'Internacional'
      }
    },
    {
      id: 47,
      homeTeam: 8,
      homeTeamGoals: 1,
      awayTeam: 14,
      awayTeamGoals: 2,
      inProgress: true,
      teamHome: {
        teamName: 'Grêmio'
      },
      teamAway: {
        teamName: 'Santos'
      }
    },
  ];

  beforeEach(() => {
    sinon.stub(Matches, 'findAll')
      .resolves(matcheListMock as unknown as Matches[]);
  });

  afterEach(() => {
    (Matches.findAll as sinon.SinonStub).restore();
  });

  it('tests a successful return from GET request of matche list', async () => {
    chaiHttpResponse = await chai.request(app).get('/matches');

    expect(chaiHttpResponse.status).to.be.equal(200);
    expect(chaiHttpResponse.body).to.be.deep.equal(matcheListMock);
  });

  it('tests a successful return from GET request of in-progress matches', async () => {
    const inProgressMatchesMock = matcheListMock
      .filter(({ inProgress }) => inProgress);

    (Matches.findAll as sinon.SinonStub).restore();
    sinon.stub(Matches, 'findAll')
      .resolves(inProgressMatchesMock as unknown as Matches[]);

    chaiHttpResponse = await chai
      .request(app)
      .get('/matches?inProgress=true');

    expect(chaiHttpResponse.status).to.be.equal(200);
    expect(chaiHttpResponse.body).to.be.deep.equal(inProgressMatchesMock);
  });

  it('tests a successful return from GET request of ended matches', async () => {
    const endedMatchesMock = matcheListMock
      .filter(({ inProgress }) => !inProgress);

    (Matches.findAll as sinon.SinonStub).restore();
    sinon.stub(Matches, 'findAll')
      .resolves(endedMatchesMock as unknown as Matches[]);

    chaiHttpResponse = await chai
      .request(app)
      .get('/matches?inProgress=false');

    expect(chaiHttpResponse.status).to.be.equal(200);
    expect(chaiHttpResponse.body).to.be.deep.equal(endedMatchesMock);
  });

  it('tests a failed return from GET request of matches with an invalid "inProgress" param in the URL', async () => {
    chaiHttpResponse = await chai
      .request(app)
      .get('/matches?inProgress=invalid');

    expect(chaiHttpResponse.status).to.be.equal(400);
    expect(chaiHttpResponse.body).to.be.deep.equal({
      message: '"inProgress" param in the URL need to be "true" or "false"',
    });
  });
});
