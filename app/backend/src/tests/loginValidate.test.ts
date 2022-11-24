import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import App from '../app';
import Users from '../database/models/UsersModel';

import { Response } from 'superagent';

chai.use(chaiHttp);

const { app } = new App();

const { expect } = chai;

describe('integration tests for /login/validate route', () => {
  let chaiHttpResponse: Response;

  beforeEach(async () => {
    sinon.stub(Users, 'findOne').resolves({
      id: 3,
      username: 'Teste',
      role: 'user',
      email: 'teste@user.com',
      password: '$2a$08$ywuLtsyUHtY7ixJZvHIp0.RopAzKAY13E.jyl3O.uX0wmrhtyw6Zm'
    } as Users);
  });

  afterEach(() => {
    (Users.findOne as sinon.SinonStub).restore();
  });

  it('tests a success login validate', async () => {
    chaiHttpResponse = await chai
      .request(app)
      .get('/login/validate')
      .set('authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywidXNlcm5hbWUiOiJUZXN0ZSIsImlhdCI6MTY2OTIyNDgyOCwiZXhwIjoxNjY5ODI5NjI4fQ.cdxH1f-RRgYNomeH--e7tIpWr3CMVP7MEG0R3OA2eyw');

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
    (Users.findOne as sinon.SinonStub).restore();
    sinon.stub(Users, 'findOne').resolves(undefined);

    chaiHttpResponse = await chai
      .request(app)
      .get('/login/validate')
      .set('authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywidXNlcm5hbWUiOiJUZXN0ZSIsImlhdCI6MTY2OTIyNDgyOCwiZXhwIjoxNjY5ODI5NjI4fQ.cdxH1f-RRgYNomeH--e7tIpWr3CMVP7MEG0R3OA2eyw');

    expect(chaiHttpResponse.status).to.be.equal(401);
    expect(chaiHttpResponse.body).to.be.deep.equal({
      message: 'Invalid token'
    });
  });

  it('tests a login validate attempt with an invalid authorization token', async () => {
    chaiHttpResponse = await chai
      .request(app)
      .get('/login/validate')
      .set('authorization', 'invalidToken');

    expect(chaiHttpResponse.status).to.be.equal(401);
    expect(chaiHttpResponse.body).to.be.deep.equal({
      message: 'Invalid token'
    });
  });
});
