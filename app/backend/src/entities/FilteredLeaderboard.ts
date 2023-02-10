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
      if (filterOption === 'home') {
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
      if (filterOption === 'home') {
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
    if (filterOption === 'home') {
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
    if (filterOption === 'home') {
      return matches
        .reduce((goals, match) => goals + match.awayTeamGoals, 0);
    }
    return matches
      .reduce((goals, match) => goals + match.homeTeamGoals, 0);
  }
}

// Code refactoring proposal:

// Transformar FilteredLeaderboard em classe abstrata que implemente apenas setTotalDraws
// e possua os outros métodos como abstratos. Ela receberia como parâmetros no construtor:
// matches e initialSettedData = { name, totalGames, totalVictories, totalLosses, goalsFavor, goalsOwn }.
// Então adicionaria o atributo: (totalDraws: FilteredLeaderboard.setTotalDraws(matches)) ao initialSettedData
// e passaria via super() à classe Leaderboard.

// Existiriam duas outras classes: HomeLeaderboard e AwayLeaderboard que extenderiam de FilteredLeaderboard.
// Elas receberiam como parâmetros no construtor: teamName e matches. Implementariam os métodos abstratos de
// FilteredLeaderboard, com suas especificidades. Formatariam o initialSettedData e passariam via super() à classe
// FilteredLeaderboard.

// Adicionaria uma LeaderboardFactory e chamaria ela na camada service:

// class LeaderboardFactory {
//   public static createLeaderboard(
//     teamName: string, matches: IMatchIdInProg[], filterOption: LeaderboardType,
//   ): FilteredLeaderboard {
//     if(filterOption === 'home') return new HomeLeaderboard(teamName, matches);
//     return new AwayLeaderboard(teamName, matches);
//   }
// }
