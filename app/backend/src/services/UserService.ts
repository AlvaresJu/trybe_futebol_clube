import { compareSync } from 'bcryptjs';
import HttpException from '../utils/HttpException';
import User from '../database/models/UserModel';
import { IJwtAuth, IServiceUser } from '../interfaces/user';

export default class UserService {
  constructor(private jwtAuth: IJwtAuth) { }

  async login(email: string, password: string): Promise<IServiceUser> {
    const user = await User.findOne({ where: { email } });
    if (!user || !compareSync(password, user.password)) {
      throw new HttpException(401, 'Incorrect email or password');
    }

    const token = this.jwtAuth.createToken({ id: user.id, username: user.username });
    return { statusCode: 200, result: token };
  }
}
