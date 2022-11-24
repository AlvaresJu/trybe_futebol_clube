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
  const matchesListMock = [
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
  ];

  beforeEach(async () => {
    sinon.stub(Matches, 'findAll').resolves(matchesListMock as unknown as Matches[]);
  });

  afterEach(()=>{
    (Matches.findAll as sinon.SinonStub).restore();
  })

  it('tests a successful return of GET matches list', async () => {
    chaiHttpResponse = await chai
      .request(app)
      .get('/matches');

    expect(chaiHttpResponse.status).to.be.equal(200);
    expect(chaiHttpResponse.body).to.be.deep.equal(matchesListMock);
  });
});
