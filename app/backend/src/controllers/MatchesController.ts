import { Request, Response } from 'express';
import MatchesService from '../services/MatchesService';

export default class MatchesController {
  constructor(private matchesService: MatchesService) { }

  private async getAllWithTeamsName(_req: Request, res: Response): Promise<Response> {
    const { statusCode, result } = await this.matchesService.getAllWithTeamsName();
    return res.status(statusCode).json(result);
  }

  private async getAllByInProgressStatus(req: Request, res: Response): Promise<Response> {
    const { statusCode, result } = await this.matchesService
      .getAllByInProgressStatus(req.query.inProgress as string);
    return res.status(statusCode).json(result);
  }

  async getAll(req: Request, res: Response): Promise<Response> {
    const { inProgress } = req.query;
    if (inProgress) return this.getAllByInProgressStatus(req, res);
    return this.getAllWithTeamsName(req, res);
  }
}
