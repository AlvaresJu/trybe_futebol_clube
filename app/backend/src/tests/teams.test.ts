import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import App from '../app';
import TeamsModel from '../database/models/TeamsModel';

import { Response } from 'superagent';
import { teamListMock } from './mocks/teamsMock';

chai.use(chaiHttp);

const { app } = new App();

const { expect } = chai;

describe('integration tests for /teams route', () => {
  let chaiHttpResponse: Response;

  beforeEach(async () => {
    sinon.stub(TeamsModel, 'findAll').resolves(teamListMock as TeamsModel[]);
  });

  afterEach(() => {
    (TeamsModel.findAll as sinon.SinonStub).restore();
  });

  it('tests a successful return from GET request of team list', async () => {
    chaiHttpResponse = await chai.request(app).get('/teams');

    expect(chaiHttpResponse.status).to.be.equal(200);
    expect(chaiHttpResponse.body).to.be.deep.equal(teamListMock);
  });
});
