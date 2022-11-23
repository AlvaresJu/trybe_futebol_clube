import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import App from '../app';
import User from '../database/models/UserModel';

import { Response } from 'superagent';

chai.use(chaiHttp);

const { app } = new App();

const { expect } = chai;

describe('integration tests for /login route', () => {
  let chaiHttpResponse: Response;

  beforeEach(async () => {
    sinon.stub(User, 'findOne').resolves({
      id: 3,
      username: 'Teste',
      role: 'user',
      email: 'teste@user.com',
      password: '$2a$08$ywuLtsyUHtY7ixJZvHIp0.RopAzKAY13E.jyl3O.uX0wmrhtyw6Zm'
    } as User);
  });

  afterEach(()=>{
    (User.findOne as sinon.SinonStub).restore();
  })

  it('tests a success login', async () => {
    chaiHttpResponse = await chai
      .request(app)
      .post('/login')
      .send({
        email: "teste@user.com",
        password: "testando123"
      });

    expect(chaiHttpResponse.status).to.be.equal(200);
    expect(chaiHttpResponse.body.token).to.be.string;
  });

  it('tests a login attempt without email and password', async () => {
    chaiHttpResponse = await chai
      .request(app)
      .post('/login')
      .send({});

    expect(chaiHttpResponse.status).to.be.equal(400);
    expect(chaiHttpResponse.body).to.be.deep.equal({
      message: 'All fields must be filled'
    });
  });

  it('tests a login attempt without email', async () => {
    chaiHttpResponse = await chai
      .request(app)
      .post('/login')
      .send({
        password: "testando123"
      });

    expect(chaiHttpResponse.status).to.be.equal(400);
    expect(chaiHttpResponse.body).to.be.deep.equal({
      message: 'All fields must be filled'
    });
  });

  it('tests a login attempt without password', async () => {
    chaiHttpResponse = await chai
      .request(app)
      .post('/login')
      .send({
        email: "teste@user.com",
      });

    expect(chaiHttpResponse.status).to.be.equal(400);
    expect(chaiHttpResponse.body).to.be.deep.equal({
      message: 'All fields must be filled'
    });
  });

  it('tests a login attempt with an invalid email', async () => {
    (User.findOne as sinon.SinonStub).restore();
    sinon.stub(User, 'findOne').resolves(undefined);

    chaiHttpResponse = await chai
      .request(app)
      .post('/login')
      .send({
        email: "invalidmail@user.com",
        password: "testando123"
      });

    expect(chaiHttpResponse.status).to.be.equal(401);
    expect(chaiHttpResponse.body).to.be.deep.equal({
      message: 'Incorrect email or password'
    });
  });

  it('tests a login attempt with an invalid password', async () => {
    chaiHttpResponse = await chai
      .request(app)
      .post('/login')
      .send({
        email: "teste@user.com",
        password: "invalidPassword"
      });

    expect(chaiHttpResponse.status).to.be.equal(401);
    expect(chaiHttpResponse.body).to.be.deep.equal({
      message: 'Incorrect email or password'
    });
  });
});
