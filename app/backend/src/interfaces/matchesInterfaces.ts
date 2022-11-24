import { ITeam } from './teamsInterfaces';

export interface IMatche {
  homeTeam: number;
  homeTeamGoals: number;
  awayTeam: number;
  awayTeamGoals: number;
  inProgress: boolean;
}

export interface IMatcheId extends IMatche {
  id: number;
}

export interface IMatcheTeamNames extends IMatcheId {
  teamHome: ITeam;
  teamAway: ITeam;
}

export interface IServiceMatches {
  statusCode: number;
  result: IMatcheTeamNames[] | IMatcheId[];
}
