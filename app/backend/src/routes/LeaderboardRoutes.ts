import * as express from 'express';
import LeaderboardController from '../controllers/LeaderboardController';

export default class LeaderboardRoutes {
  public leaderboardRouter: express.IRouter;

  constructor() {
    this.leaderboardRouter = express.Router();

    this.leaderboardRouter
      .get('/home', (req, res) => LeaderboardController.getHomeTeamLeaderboard(req, res));
    this.leaderboardRouter
      .get('/away', (req, res) => LeaderboardController.getAwayTeamLeaderboard(req, res));
  }
}
