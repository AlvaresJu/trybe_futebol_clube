import { IMatchIdInProg } from '../interfaces/matchesInterfaces';
import FilteredLeaderboard from './FilteredLeaderboard';

export default class AwayLeaderboard extends FilteredLeaderboard {
  constructor(teamName: string, matches: IMatchIdInProg[]) {
    const initialSettedData = {
      name: teamName,
      totalGames: matches.length,
      totalVictories: AwayLeaderboard.setTotalVictories(matches),
      totalLosses: AwayLeaderboard.setTotalLosses(matches),
      goalsFavor: AwayLeaderboard.setGoalsFavor(matches),
      goalsOwn: AwayLeaderboard.setGoalsOwn(matches),
    };
    super(matches, initialSettedData);
  }

  private static setTotalVictories(matches: IMatchIdInProg[]): number {
    return matches.reduce((victories, match) => {
      const victory = match.homeTeamGoals < match.awayTeamGoals;
      return victory ? victories + 1 : victories;
    }, 0);
  }

  private static setTotalLosses(matches: IMatchIdInProg[]): number {
    return matches.reduce((losses, match) => {
      const loss = match.homeTeamGoals > match.awayTeamGoals;
      return loss ? losses + 1 : losses;
    }, 0);
  }

  private static setGoalsFavor(matches: IMatchIdInProg[]): number {
    return matches
      .reduce((goals, match) => goals + match.awayTeamGoals, 0);
  }

  private static setGoalsOwn(matches: IMatchIdInProg[]): number {
    return matches
      .reduce((goals, match) => goals + match.homeTeamGoals, 0);
  }
}
