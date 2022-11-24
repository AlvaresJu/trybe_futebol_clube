import { Request, Response } from 'express';
import MatchesService from '../services/MatchesService';

export default class MatchesController {
  static async getAllWithTeamsName(_req: Request, res: Response): Promise<Response> {
    const { statusCode, result } = await MatchesService.getAllWithTeamsName();
    return res.status(statusCode).json(result);
  }
}
