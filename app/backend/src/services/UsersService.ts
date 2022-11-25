import { compareSync } from 'bcryptjs';
import HttpException from '../utils/HttpException';
import UsersModel from '../database/models/UsersModel';
import { IJwtAuth, IServiceLogin } from '../interfaces/usersInterfaces';

export default class UsersService {
  constructor(private jwtAuth: IJwtAuth) { }

  async login(email: string, password: string): Promise<IServiceLogin> {
    const user = await UsersModel.findOne({ where: { email } });
    if (!user || !compareSync(password, user.password)) {
      throw new HttpException(401, 'Incorrect email or password');
    }

    const token = this.jwtAuth.createToken({ id: user.id, username: user.username });
    return { statusCode: 200, result: token };
  }

  async validateLogin(token: string | undefined): Promise<IServiceLogin> {
    const id = this.jwtAuth.validateAuth(token);
    const user = await UsersModel.findOne({ where: { id } });
    if (!user) {
      throw new HttpException(401, 'Token must be a valid token');
    }

    return { statusCode: 200, result: user.role };
  }
}
