import { Request, Response } from 'express';
import UsersService from '../services/UsersService';

export default class UsersController {
  constructor(private usersService: UsersService) { }

  async login(req: Request, res: Response): Promise<Response> {
    const { email, password } = req.body;
    const { statusCode, result } = await this.usersService.login(email, password);
    return res.status(statusCode).json({ token: result });
  }

  async validateLogin(req: Request, res: Response): Promise<Response> {
    const { authorization } = req.headers;
    const { statusCode, result } = await this.usersService.validateLogin(authorization);
    return res.status(statusCode).json({ role: result });
  }
}
