import { Request, Response } from 'express';
import TeamsService from '../services/TeamsService';

export default class TeamsController {
  static async getAll(_req: Request, res: Response): Promise<Response> {
    const { statusCode, result } = await TeamsService.getAll();
    return res.status(statusCode).json(result);
  }
}
