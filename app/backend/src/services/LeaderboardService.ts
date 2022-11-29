import TeamsModel from '../database/models/TeamsModel';
import {
  ILeaderboardData, IServiceLeaderboard, LeaderboardType,
} from '../interfaces/leaderboardInterfaces';
import { ITeamId } from '../interfaces/teamsInterfaces';
import MatchesModel from '../database/models/MatchesModel';
import FilteredLeaderboard from '../entities/FilteredLeaderboard';

export default class LeaderboardService {
  private static async setHomeTeamData(id: number, name: string): Promise<ILeaderboardData> {
    const teamMatches = await MatchesModel.findAll({ where: {
      inProgress: false,
      homeTeam: id,
    } });
    const teamData = new FilteredLeaderboard(name, teamMatches, 'homeTeam');
    return {
      name: teamData.name,
      totalPoints: teamData.totalPoints,
      totalGames: teamData.totalGames,
      totalVictories: teamData.totalVictories,
      totalDraws: teamData.totalDraws,
      totalLosses: teamData.totalLosses,
      goalsFavor: teamData.goalsFavor,
      goalsOwn: teamData.goalsOwn,
      goalsBalance: teamData.goalsBalance,
      efficiency: teamData.efficiency,
    };
  }

  private static async setAwayTeamData(id: number, name: string): Promise<ILeaderboardData> {
    const teamMatches = await MatchesModel.findAll({ where: {
      inProgress: false,
      awayTeam: id,
    } });
    const teamData = new FilteredLeaderboard(name, teamMatches, 'awayTeam');
    return {
      name: teamData.name,
      totalPoints: teamData.totalPoints,
      totalGames: teamData.totalGames,
      totalVictories: teamData.totalVictories,
      totalDraws: teamData.totalDraws,
      totalLosses: teamData.totalLosses,
      goalsFavor: teamData.goalsFavor,
      goalsOwn: teamData.goalsOwn,
      goalsBalance: teamData.goalsBalance,
      efficiency: teamData.efficiency,
    };
  }

  private static async setFilteredLeaderboard(
    teams: ITeamId[],
    filterOption: LeaderboardType,
  ): Promise<ILeaderboardData[]> {
    const leadboardPromises = teams.map(async ({ id, teamName }) => {
      if (filterOption === 'homeTeam') {
        return LeaderboardService.setHomeTeamData(id, teamName);
      }

      return LeaderboardService.setAwayTeamData(id, teamName);
    });
    return Promise.all(leadboardPromises);
  }

  private static sortByTotalPoints(leaderboardData: ILeaderboardData[]) {
    return leaderboardData.sort((teamA, teamB) => {
      const sameTotalPoints = teamA.totalPoints === teamB.totalPoints;
      const sameTotalVictories = teamA.totalVictories === teamB.totalVictories;
      const sameGoalsBalance = teamA.goalsBalance === teamB.goalsBalance;
      const sameGoalsFavor = teamA.goalsFavor === teamB.goalsFavor;

      const goalsFavorCriterion = sameGoalsFavor
        ? teamB.goalsOwn - teamA.goalsOwn : teamB.goalsFavor - teamA.goalsFavor;
      const goalsBalanceCriterion = sameGoalsBalance
        ? goalsFavorCriterion : teamB.goalsBalance - teamA.goalsBalance;
      const totalVictoriesCriterion = sameTotalVictories
        ? goalsBalanceCriterion : teamB.totalVictories - teamA.totalVictories;

      return sameTotalPoints ? totalVictoriesCriterion : teamB.totalPoints - teamA.totalPoints;
    });
  }

  static async getFilteredLeaderboard(filterOption: LeaderboardType): Promise<IServiceLeaderboard> {
    const teams = await TeamsModel.findAll();
    const leaderboardData = await LeaderboardService.setFilteredLeaderboard(teams, filterOption);
    const result = LeaderboardService.sortByTotalPoints(leaderboardData);
    return { statusCode: 200, result };
  }
}
