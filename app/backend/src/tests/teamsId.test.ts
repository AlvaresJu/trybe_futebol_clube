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

describe('integration tests for /teams/:id route', () => {
  let chaiHttpResponse: Response;
  const teamMock = {
      id: 2,
      teamName: "Bahia"
    };

  beforeEach(async () => {
    sinon.stub(Teams, 'findOne').resolves(teamMock as Teams);
  });

  afterEach(()=>{
    (Teams.findOne as sinon.SinonStub).restore();
  })

  it('tests a successful return of a team', async () => {
    chaiHttpResponse = await chai
      .request(app)
      .get('/teams/2');

    expect(chaiHttpResponse.status).to.be.equal(200);
    expect(chaiHttpResponse.body).to.be.deep.equal(teamMock);
  });

  it('tests a failed return from a non-existent team request', async () => {
    (Teams.findOne as sinon.SinonStub).restore();
    sinon.stub(Teams, 'findOne').resolves(undefined);

    chaiHttpResponse = await chai
      .request(app)
      .get('/teams/99');

    expect(chaiHttpResponse.status).to.be.equal(404);
    expect(chaiHttpResponse.body).to.be.deep.equal({
      message: 'Team does not exist'
    });
  });
});
