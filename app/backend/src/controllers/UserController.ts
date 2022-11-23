import { Request, Response } from 'express';
import UserService from '../services/UserService';

export default class UserController {
  constructor(private userService: UserService) { }

  async login(req: Request, res: Response) {
    const { email, password } = req.body;
    const { statusCode, result } = await this.userService.login(email, password);
    return res.status(statusCode).json({ token: result });
  }
}
