import { ILeaderboardData } from '../interfaces/leaderboardInterfaces';
import Leaderboard from './Leaderboard';

export default class AllLeaderboard extends Leaderboard {
  constructor(homeTeam: ILeaderboardData, awayTeam: ILeaderboardData) {
    const settedData = {
      name: homeTeam.name,
      totalGames: homeTeam.totalGames + awayTeam.totalGames,
      totalVictories: homeTeam.totalVictories + awayTeam.totalVictories,
      totalDraws: homeTeam.totalDraws + awayTeam.totalDraws,
      totalLosses: homeTeam.totalLosses + awayTeam.totalLosses,
      goalsFavor: homeTeam.goalsFavor + awayTeam.goalsFavor,
      goalsOwn: homeTeam.goalsOwn + awayTeam.goalsOwn,
    };
    super(settedData);
  }
}
