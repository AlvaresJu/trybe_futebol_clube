import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import App from '../app';
import TeamsModel from '../database/models/TeamsModel';

import { Response } from 'superagent';
import { teamMock } from './mocks/teamsMock';

chai.use(chaiHttp);

const { app } = new App();

const { expect } = chai;

describe('integration tests for /teams/:id route', () => {
  let chaiHttpResponse: Response;

  beforeEach(async () => {
    sinon.stub(TeamsModel, 'findOne').resolves(teamMock as TeamsModel);
  });

  afterEach(() => {
    (TeamsModel.findOne as sinon.SinonStub).restore();
  });

  it('tests a successful return from GET request of a team', async () => {
    chaiHttpResponse = await chai.request(app).get('/teams/2');

    expect(chaiHttpResponse.status).to.be.equal(200);
    expect(chaiHttpResponse.body).to.be.deep.equal(teamMock);
  });

  it('tests a failed return from GET request of a non-existent team', async () => {
    (TeamsModel.findOne as sinon.SinonStub).restore();
    sinon.stub(TeamsModel, 'findOne').resolves(undefined);

    chaiHttpResponse = await chai.request(app).get('/teams/99');

    expect(chaiHttpResponse.status).to.be.equal(404);
    expect(chaiHttpResponse.body).to.be.deep.equal({
      message: 'There is no team with such id!',
    });
  });
});
