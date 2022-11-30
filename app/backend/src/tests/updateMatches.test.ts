import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import App from '../app';

import { Response } from 'superagent';
import MatchesModel from '../database/models/MatchesModel';

chai.use(chaiHttp);

const { app } = new App();

const { expect } = chai;

describe('integration tests for PATCH /matches routes', () => {
  let chaiHttpResponse: Response;

  const matchMock = {
    id: 1,
    homeTeam: 16,
    homeTeamGoals: 2,
    awayTeam: 8,
    awayTeamGoals: 2,
    inProgress: true,
  };
  const finishedMatchMock = {
    id: 1,
    homeTeam: 16,
    homeTeamGoals: 2,
    awayTeam: 8,
    awayTeamGoals: 2,
    inProgress: false,
  }
  const updateReturnMock = [1];

  beforeEach(() => {
    sinon.stub(MatchesModel, 'findOne').resolves(matchMock as MatchesModel);

    sinon.stub(MatchesModel, 'update')
      .resolves(updateReturnMock as [affectedCount: number]);
  });

  afterEach(() => {
    (MatchesModel.findOne as sinon.SinonStub).restore();

    (MatchesModel.update as sinon.SinonStub).restore();
  });

  it('tests a successful update of a match in-progress status', async () => {
    chaiHttpResponse = await chai.request(app).patch('/matches/1/finish');

    expect(chaiHttpResponse.status).to.be.equal(200);
    expect(chaiHttpResponse.body).to.be.deep.equal({ message: 'Finished' });
  });

  it('tests an attempt to update in-progress status of a non-existent match', async () => {
    (MatchesModel.findOne as sinon.SinonStub).restore();
    sinon.stub(MatchesModel, 'findOne').resolves(undefined);

    chaiHttpResponse = await chai.request(app).patch('/matches/999/finish');

    expect(chaiHttpResponse.status).to.be.equal(404);
    expect(chaiHttpResponse.body).to.be.deep.equal({
      message: 'There is no match with such id!',
    });
  });

  it('tests a successful update of a in-progress match goals', async () => {
    chaiHttpResponse = await chai
      .request(app)
      .patch('/matches/1')
      .send({
        homeTeamGoals: 3,
        awayTeamGoals: 4,
      });

    expect(chaiHttpResponse.status).to.be.equal(200);
    expect(chaiHttpResponse.body).to.be.deep.equal({ message: 'Match goals updated' });
  });

  it('tests an attempt to update goals without "homeTeamGoals" and "awayTeamGoals" informations', async () => {
    chaiHttpResponse = await chai.request(app).patch('/matches/1');

    expect(chaiHttpResponse.status).to.be.equal(400);
    expect(chaiHttpResponse.body).to.be.deep.equal({ message: 'All fields must be filled' });
  });

  it('tests an attempt to update goals without "homeTeamGoals" information', async () => {
    chaiHttpResponse = await chai
      .request(app)
      .patch('/matches/1')
      .send({
        awayTeamGoals: 4,
      });

    expect(chaiHttpResponse.status).to.be.equal(400);
    expect(chaiHttpResponse.body).to.be.deep.equal({ message: 'All fields must be filled' });
  });

  it('tests an attempt to update goals without "awayTeamGoals" information', async () => {
    chaiHttpResponse = await chai
      .request(app)
      .patch('/matches/1')
      .send({
        homeTeamGoals: 3,
      });

    expect(chaiHttpResponse.status).to.be.equal(400);
    expect(chaiHttpResponse.body).to.be.deep.equal({ message: 'All fields must be filled' });
  });

  it('tests an attempt to update goals of a non-existent match', async () => {
    (MatchesModel.findOne as sinon.SinonStub).restore();
    sinon.stub(MatchesModel, 'findOne').resolves(undefined);

    chaiHttpResponse = await chai
      .request(app)
      .patch('/matches/999')
      .send({
        homeTeamGoals: 3,
        awayTeamGoals: 4,
      });

    expect(chaiHttpResponse.status).to.be.equal(404);
    expect(chaiHttpResponse.body).to.be.deep.equal({
      message: 'There is no match with such id!',
    });
  });

  it('tests an attempt to update goals of a finished match', async () => {
    (MatchesModel.findOne as sinon.SinonStub).restore();
    sinon.stub(MatchesModel, 'findOne').resolves(finishedMatchMock as MatchesModel);

    chaiHttpResponse = await chai
      .request(app)
      .patch('/matches/1')
      .send({
        homeTeamGoals: 3,
        awayTeamGoals: 4,
      });

    expect(chaiHttpResponse.status).to.be.equal(400);
    expect(chaiHttpResponse.body).to.be.deep.equal({
      message: 'This match has already ended and can not be updated.',
    });
  });
});
