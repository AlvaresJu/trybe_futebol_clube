import TeamsModel from '../database/models/TeamsModel';
import {
  ILeaderboardData, IServiceLeaderboard, LeaderboardType,
} from '../interfaces/leaderboardInterfaces';
import { ITeamId } from '../interfaces/teamsInterfaces';
import MatchesModel from '../database/models/MatchesModel';
import FilteredLeaderboard from '../entities/FilteredLeaderboard';
import AllLeaderboard from '../entities/AllLeaderboard';
import Leaderboard from '../entities/Leaderboard';
import { IMatchIdInProg } from '../interfaces/matchesInterfaces';

export default class LeaderboardService {
  private static async getTeamMatches(
    id: number,
    filterOption: LeaderboardType,
  ): Promise<IMatchIdInProg[]> {
    if (filterOption === 'home') {
      return MatchesModel.findAll({ where: {
        inProgress: false,
        homeTeam: id,
      } });
    }
    return MatchesModel.findAll({ where: {
      inProgress: false,
      awayTeam: id,
    } });
  }

  private static setLeaderboardTeamData(teamDataEntity: Leaderboard): ILeaderboardData {
    return {
      name: teamDataEntity.name,
      totalPoints: teamDataEntity.totalPoints,
      totalGames: teamDataEntity.totalGames,
      totalVictories: teamDataEntity.totalVictories,
      totalDraws: teamDataEntity.totalDraws,
      totalLosses: teamDataEntity.totalLosses,
      goalsFavor: teamDataEntity.goalsFavor,
      goalsOwn: teamDataEntity.goalsOwn,
      goalsBalance: teamDataEntity.goalsBalance,
      efficiency: teamDataEntity.efficiency,
    };
  }

  private static async setFilteredLeaderboard(
    teams: ITeamId[],
    filterOption: LeaderboardType,
  ): Promise<ILeaderboardData[]> {
    const leadboardPromises = teams.map(async ({ id, teamName }) => {
      const teamMatches = await LeaderboardService.getTeamMatches(id, filterOption);
      const teamData = new FilteredLeaderboard(teamName, teamMatches, filterOption);
      return LeaderboardService.setLeaderboardTeamData(teamData);
    });
    return Promise.all(leadboardPromises);
  }

  private static async setAllLeaderboard(teams: ITeamId[]): Promise<ILeaderboardData[]> {
    const homeLeaderboard = await LeaderboardService.setFilteredLeaderboard(teams, 'home');
    const awayLeaderboard = await LeaderboardService.setFilteredLeaderboard(teams, 'away');

    const allLeadboard = teams.map(({ teamName }) => {
      const homeTeamData = homeLeaderboard
        .find(({ name }) => name === teamName) as ILeaderboardData;
      const awayTeamData = awayLeaderboard
        .find(({ name }) => name === teamName) as ILeaderboardData;
      const allTeamData = new AllLeaderboard(homeTeamData, awayTeamData);
      return LeaderboardService.setLeaderboardTeamData(allTeamData);
    });
    return allLeadboard;
  }

  private static sortByTotalPoints(leaderboardData: ILeaderboardData[]) {
    return leaderboardData.sort((teamA, teamB) => {
      const sameTotalPoints = teamA.totalPoints === teamB.totalPoints;
      const sameTotalVictories = teamA.totalVictories === teamB.totalVictories;
      const sameGoalsBalance = teamA.goalsBalance === teamB.goalsBalance;
      const sameGoalsFavor = teamA.goalsFavor === teamB.goalsFavor;

      const goalsFavorCriterion = sameGoalsFavor
        ? teamA.goalsOwn - teamB.goalsOwn : teamB.goalsFavor - teamA.goalsFavor;
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

  static async getAllLeaderboard(): Promise<IServiceLeaderboard> {
    const teams = await TeamsModel.findAll();
    const leaderboardData = await LeaderboardService.setAllLeaderboard(teams);
    const result = LeaderboardService.sortByTotalPoints(leaderboardData);
    return { statusCode: 200, result };
  }
}
