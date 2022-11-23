import { compareSync } from 'bcryptjs';
import HttpException from '../utils/HttpException';
import User from '../database/models/UserModel';
import { IJwtAuth, IServiceLogin } from '../interfaces/user';

export default class UserService {
  constructor(private jwtAuth: IJwtAuth) { }

  async login(email: string, password: string): Promise<IServiceLogin> {
    const user = await User.findOne({ where: { email } });
    if (!user || !compareSync(password, user.password)) {
      throw new HttpException(401, 'Incorrect email or password');
    }

    const token = this.jwtAuth.createToken({ id: user.id, username: user.username });
    return { statusCode: 200, result: token };
  }

  private validateAuth(token: string | undefined): number {
    if (!token) throw new HttpException(401, 'Token not found');

    const userId = this.jwtAuth.validateToken(token);
    return userId;
  }

  async validateLogin(token: string | undefined): Promise<IServiceLogin> {
    const id = this.validateAuth(token);
    const user = await User.findOne({ where: { id } });
    if (!user) {
      throw new HttpException(401, 'Invalid token');
    }

    return { statusCode: 200, result: user.role };
  }
}
