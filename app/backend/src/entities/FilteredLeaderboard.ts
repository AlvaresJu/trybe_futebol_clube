import Leaderboard from './Leaderboard';
import { IMatchIdInProg } from '../interfaces/matchesInterfaces';
import { LeaderboardType } from '../interfaces/leaderboardInterfaces';

export default class FilteredLeaderboard extends Leaderboard {
  constructor(teamName: string, matches: IMatchIdInProg[], filterOption: LeaderboardType) {
    const settedData = {
      name: teamName,
      totalGames: matches.length,
      totalVictories: FilteredLeaderboard.setTotalVictories(matches, filterOption),
      totalDraws: FilteredLeaderboard.setTotalDraws(matches),
      totalLosses: FilteredLeaderboard.setTotalLosses(matches, filterOption),
      goalsFavor: FilteredLeaderboard.setGoalsFavor(matches, filterOption),
      goalsOwn: FilteredLeaderboard.setGoalsOwn(matches, filterOption),
    };
    super(settedData);
  }

  private static setTotalVictories(
    matches: IMatchIdInProg[],
    filterOption: LeaderboardType,
  ): number {
    return matches.reduce((victories, match) => {
      let victory: boolean;
      if (filterOption === 'homeTeam') {
        victory = match.homeTeamGoals > match.awayTeamGoals;
      } else {
        victory = match.homeTeamGoals < match.awayTeamGoals;
      }
      return victory ? victories + 1 : victories;
    }, 0);
  }

  private static setTotalDraws(matches: IMatchIdInProg[]): number {
    return matches.reduce((draws, match) => {
      const draw = match.homeTeamGoals === match.awayTeamGoals;
      return draw ? draws + 1 : draws;
    }, 0);
  }

  private static setTotalLosses(
    matches: IMatchIdInProg[],
    filterOption: LeaderboardType,
  ): number {
    return matches.reduce((losses, match) => {
      let loss: boolean;
      if (filterOption === 'homeTeam') {
        loss = match.homeTeamGoals < match.awayTeamGoals;
      } else {
        loss = match.homeTeamGoals > match.awayTeamGoals;
      }
      return loss ? losses + 1 : losses;
    }, 0);
  }

  private static setGoalsFavor(
    matches: IMatchIdInProg[],
    filterOption: LeaderboardType,
  ): number {
    if (filterOption === 'homeTeam') {
      return matches
        .reduce((goals, match) => goals + match.homeTeamGoals, 0);
    }

    return matches
      .reduce((goals, match) => goals + match.awayTeamGoals, 0);
  }

  private static setGoalsOwn(
    matches: IMatchIdInProg[],
    filterOption: LeaderboardType,
  ): number {
    if (filterOption === 'homeTeam') {
      return matches
        .reduce((goals, match) => goals + match.awayTeamGoals, 0);
    }

    return matches
      .reduce((goals, match) => goals + match.homeTeamGoals, 0);
  }
}
