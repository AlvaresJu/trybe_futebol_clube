export type LeaderboardType = 'home' | 'away';

export interface IInitialLeaderboardData {
  name: string;
  totalGames: number;
  totalVictories: number;
  totalLosses: number;
  goalsFavor: number;
  goalsOwn: number;
}
export interface IFilteredLeaderboardData extends IInitialLeaderboardData {
  totalDraws: number;
}

export interface ILeaderboardData extends IFilteredLeaderboardData {
  totalPoints: number;
  goalsBalance: number;
  efficiency: string;
}

export interface IServiceLeaderboard {
  statusCode: number;
  result: ILeaderboardData[];
}
