import { LeaderboardType } from '../interfaces/leaderboardInterfaces';
import { IMatchIdInProg } from '../interfaces/matchesInterfaces';
import AwayLeaderboard from './AwayLeaderboard';
import FilteredLeaderboard from './FilteredLeaderboard';
import HomeLeaderboard from './HomeLeaderboard';

export default class LeaderboarFactory {
  public static createLeaderboard(
    teamName: string,
    matches: IMatchIdInProg[],
    filterOption: LeaderboardType,
  ): FilteredLeaderboard {
    if (filterOption === 'home') return new HomeLeaderboard(teamName, matches);
    return new AwayLeaderboard(teamName, matches);
  }
}
