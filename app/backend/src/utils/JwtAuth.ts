import { config } from 'dotenv';
import { sign, verify } from 'jsonwebtoken';
import { IAuthData, IJwtAuth } from '../interfaces/usersInterfaces';
import HttpException from './HttpException';

config();

export default class JwtAuth implements IJwtAuth {
  private _jwtSecret: string;

  constructor() {
    this._jwtSecret = process.env.JWT_SECRET as string;
  }

  createToken(data: IAuthData): string {
    const token = sign(data, this._jwtSecret, { expiresIn: '7d' });
    return token;
  }

  validateToken(token: string): number {
    try {
      const { id } = verify(token, this._jwtSecret) as IAuthData;
      return id;
    } catch (_e) {
      throw new HttpException(401, 'Invalid token');
    }
  }
}
