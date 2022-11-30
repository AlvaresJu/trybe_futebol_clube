import { Request, Response } from 'express';
import { LeaderboardType } from '../interfaces/leaderboardInterfaces';
import LeaderboardService from '../services/LeaderboardService';

export default class LeaderboardController {
  static async getFilteredLeaderboard(req: Request, res: Response): Promise<Response> {
    const url = req.originalUrl;
    const filterOption = url.substring(13) as LeaderboardType;
    const { statusCode, result } = await LeaderboardService.getFilteredLeaderboard(filterOption);
    return res.status(statusCode).json(result);
  }

  static async getAllLeaderboard(_req: Request, res: Response): Promise<Response> {
    const { statusCode, result } = await LeaderboardService.getAllLeaderboard();
    return res.status(statusCode).json(result);
  }
}
