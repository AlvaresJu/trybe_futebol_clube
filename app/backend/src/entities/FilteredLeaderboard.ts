import Leaderboard from './Leaderboard';
import { IMatchIdInProg } from '../interfaces/matchesInterfaces';
import { IInitialLeaderboardData } from '../interfaces/leaderboardInterfaces';

export default abstract class FilteredLeaderboard extends Leaderboard {
  constructor(matches: IMatchIdInProg[], initialSettedData: IInitialLeaderboardData) {
    const settedData = {
      ...initialSettedData,
      totalDraws: FilteredLeaderboard.setTotalDraws(matches),
    };
    super(settedData);
  }

  private static setTotalDraws(matches: IMatchIdInProg[]): number {
    return matches.reduce((draws, match) => {
      const draw = match.homeTeamGoals === match.awayTeamGoals;
      return draw ? draws + 1 : draws;
    }, 0);
  }
}
