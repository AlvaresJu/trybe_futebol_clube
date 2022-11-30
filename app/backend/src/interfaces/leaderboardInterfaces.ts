export type LeaderboardType = 'home' | 'away';

export interface ILeaderboardSettedData {
  name: string;
  totalGames: number;
  totalVictories: number;
  totalDraws: number;
  totalLosses: number;
  goalsFavor: number;
  goalsOwn: number;
}

export interface ILeaderboardData extends ILeaderboardSettedData {
  totalPoints: number;
  goalsBalance: number;
  efficiency: string;
}

export interface IServiceLeaderboard {
  statusCode: number;
  result: ILeaderboardData[];
}
