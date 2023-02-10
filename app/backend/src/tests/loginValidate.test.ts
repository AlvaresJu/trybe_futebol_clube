import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import App from '../app';
import UsersModel from '../database/models/UsersModel';

import { Response } from 'superagent';

chai.use(chaiHttp);

const { app } = new App();

const { expect } = chai;

describe('integration tests for /login/validate route', () => {
  let chaiHttpResponse: Response;

  beforeEach(async () => {
    sinon.stub(UsersModel, 'findOne').resolves({
      id: 3,
      username: 'Teste',
      role: 'user',
      email: 'teste@user.com',
      password: '$2a$08$ywuLtsyUHtY7ixJZvHIp0.RopAzKAY13E.jyl3O.uX0wmrhtyw6Zm'
    } as UsersModel);
  });

  afterEach(() => {
    (UsersModel.findOne as sinon.SinonStub).restore();
  });

  it('tests a success login validate', async () => {
    chaiHttpResponse = await chai
      .request(app)
      .get('/login/validate')
      .set('authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJBZG1pbiIsImlhdCI6MTY3NjAwODA2MCwiZXhwIjoxNjg2Mzc2MDYwfQ.BNcBgdAx_Q-jPkQHL_E_mgUE4TGuNMPxI-XTxG0sIB8');

    expect(chaiHttpResponse.status).to.be.equal(200);
    expect(chaiHttpResponse.body).to.be.deep.equal({ role: 'user' });
  });

  it('tests a login validate attempt without authorization token', async () => {
    chaiHttpResponse = await chai.request(app).get('/login/validate');

    expect(chaiHttpResponse.status).to.be.equal(401);
    expect(chaiHttpResponse.body).to.be.deep.equal({
      message: 'Token not found'
    });
  });

  it('tests a login validate attempt with an authorization token from an invalid user', async () => {
    (UsersModel.findOne as sinon.SinonStub).restore();
    sinon.stub(UsersModel, 'findOne').resolves(undefined);

    chaiHttpResponse = await chai
      .request(app)
      .get('/login/validate')
      .set('authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJBZG1pbiIsImlhdCI6MTY3NjAwODA2MCwiZXhwIjoxNjg2Mzc2MDYwfQ.BNcBgdAx_Q-jPkQHL_E_mgUE4TGuNMPxI-XTxG0sIB8');

    expect(chaiHttpResponse.status).to.be.equal(401);
    expect(chaiHttpResponse.body).to.be.deep.equal({
      message: 'Token must be a valid token'
    });
  });

  it('tests a login validate attempt with an invalid authorization token', async () => {
    chaiHttpResponse = await chai
      .request(app)
      .get('/login/validate')
      .set('authorization', 'invalidToken');

    expect(chaiHttpResponse.status).to.be.equal(401);
    expect(chaiHttpResponse.body).to.be.deep.equal({
      message: 'Token must be a valid token'
    });
  });
});
