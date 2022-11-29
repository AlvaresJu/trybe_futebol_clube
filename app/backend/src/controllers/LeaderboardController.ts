import { Request, Response } from 'express';
import LeaderboardService from '../services/LeaderboardService';

export default class LeaderboardController {
  static async getHomeTeamLeaderboard(_req: Request, res: Response): Promise<Response> {
    const { statusCode, result } = await LeaderboardService.getFilteredLeaderboard('homeTeam');
    return res.status(statusCode).json(result);
  }

  static async getAwayTeamLeaderboard(_req: Request, res: Response): Promise<Response> {
    const { statusCode, result } = await LeaderboardService.getFilteredLeaderboard('awayTeam');
    return res.status(statusCode).json(result);
  }
}
