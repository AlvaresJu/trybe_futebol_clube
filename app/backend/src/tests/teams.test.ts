import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import App from '../app';
import Teams from '../database/models/TeamsModel';

import { Response } from 'superagent';

chai.use(chaiHttp);

const { app } = new App();

const { expect } = chai;

describe('integration tests for /teams route', () => {
  let chaiHttpResponse: Response;
  const teamListMock = [
    {
      id: 1,
      teamName: "Avaí/Kindermann"
    },
    {
      id: 2,
      teamName: "Bahia"
    },
    {
      id: 3,
      teamName: "Botafogo"
    },
    {
      id: 4,
      teamName: "Corinthians"
    },
    {
      id: 5,
      teamName: "Cruzeiro"
    }
  ];

  beforeEach(async () => {
    sinon.stub(Teams, 'findAll').resolves(teamListMock as Teams[]);
  });

  afterEach(() => {
    (Teams.findAll as sinon.SinonStub).restore();
  });

  it('tests a successful return from GET request of team list', async () => {
    chaiHttpResponse = await chai.request(app).get('/teams');

    expect(chaiHttpResponse.status).to.be.equal(200);
    expect(chaiHttpResponse.body).to.be.deep.equal(teamListMock);
  });
});
