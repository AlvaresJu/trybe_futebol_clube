import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import App from '../app';

import { Response } from 'superagent';
import MatchesModel from '../database/models/MatchesModel';
import { matchListMock } from './mocks/matchesMock';

chai.use(chaiHttp);

const { app } = new App();

const { expect } = chai;

describe('integration tests for GET /matches routes', () => {
  let chaiHttpResponse: Response;
  
  beforeEach(() => {
    sinon.stub(MatchesModel, 'findAll')
      .resolves(matchListMock as unknown as MatchesModel[]);
  });

  afterEach(() => {
    (MatchesModel.findAll as sinon.SinonStub).restore();
  });

  it('tests a successful return of matche list', async () => {
    chaiHttpResponse = await chai.request(app).get('/matches');

    expect(chaiHttpResponse.status).to.be.equal(200);
    expect(chaiHttpResponse.body).to.be.deep.equal(matchListMock);
  });

  it('tests a successful return of in-progress matches', async () => {
    const inProgressMatchesMock = matchListMock
      .filter(({ inProgress }) => inProgress);

    (MatchesModel.findAll as sinon.SinonStub).restore();
    sinon.stub(MatchesModel, 'findAll')
      .resolves(inProgressMatchesMock as unknown as MatchesModel[]);

    chaiHttpResponse = await chai
      .request(app)
      .get('/matches?inProgress=true');

    expect(chaiHttpResponse.status).to.be.equal(200);
    expect(chaiHttpResponse.body).to.be.deep.equal(inProgressMatchesMock);
  });

  it('tests a successful return of ended matches', async () => {
    const endedMatchesMock = matchListMock
      .filter(({ inProgress }) => !inProgress);

    (MatchesModel.findAll as sinon.SinonStub).restore();
    sinon.stub(MatchesModel, 'findAll')
      .resolves(endedMatchesMock as unknown as MatchesModel[]);

    chaiHttpResponse = await chai
      .request(app)
      .get('/matches?inProgress=false');

    expect(chaiHttpResponse.status).to.be.equal(200);
    expect(chaiHttpResponse.body).to.be.deep.equal(endedMatchesMock);
  });

  it('tests a failed return of matches with an invalid "inProgress" param in the URL', async () => {
    chaiHttpResponse = await chai
      .request(app)
      .get('/matches?inProgress=invalid');

    expect(chaiHttpResponse.status).to.be.equal(400);
    expect(chaiHttpResponse.body).to.be.deep.equal({
      message: '"inProgress" param in the URL need to be "true" or "false"',
    });
  });
});
