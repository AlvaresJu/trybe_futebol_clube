import { ILeaderboardData, IFilteredLeaderboardData } from '../interfaces/leaderboardInterfaces';

export default abstract class Leaderboard implements ILeaderboardData {
  private _name: string;
  private _totalPoints: number;
  private _totalGames: number;
  private _totalVictories: number;
  private _totalDraws: number;
  private _totalLosses: number;
  private _goalsFavor: number;
  private _goalsOwn: number;
  private _goalsBalance: number;
  private _efficiency: string;

  constructor(settedData: IFilteredLeaderboardData) {
    this._name = settedData.name;
    this._totalGames = settedData.totalGames;
    this._totalVictories = settedData.totalVictories;
    this._totalDraws = settedData.totalDraws;
    this._totalLosses = settedData.totalLosses;
    this._goalsFavor = settedData.goalsFavor;
    this._goalsOwn = settedData.goalsOwn;

    this._totalPoints = this.setTotalPoints();
    this._goalsBalance = this.setGoalsBalance();
    this._efficiency = this.setEfficiency();
  }

  get name() { return this._name; }
  get totalPoints() { return this._totalPoints; }
  get totalGames() { return this._totalGames; }
  get totalVictories() { return this._totalVictories; }
  get totalDraws() { return this._totalDraws; }
  get totalLosses() { return this._totalLosses; }
  get goalsFavor() { return this._goalsFavor; }
  get goalsOwn() { return this._goalsOwn; }
  get goalsBalance() { return this._goalsBalance; }
  get efficiency() { return this._efficiency; }

  private setTotalPoints(): number {
    return (this._totalVictories * 3) + this._totalDraws;
  }

  private setGoalsBalance(): number {
    return this._goalsFavor - this._goalsOwn;
  }

  private setEfficiency(): string {
    const efficiency = (this._totalPoints / (this._totalGames * 3)) * 100;
    return efficiency.toFixed(2);
  }
}
