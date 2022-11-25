export interface IMatch {
  homeTeam: number;
  homeTeamGoals: number;
  awayTeam: number;
  awayTeamGoals: number;
}

export interface IMatchIdInProg extends IMatch {
  id: number;
  inProgress: boolean;
}

export interface IServiceMatches {
  statusCode: number;
  result: IMatchIdInProg[] | IMatchIdInProg | string;
}
