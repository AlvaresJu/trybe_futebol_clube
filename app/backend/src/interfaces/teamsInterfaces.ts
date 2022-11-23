export interface ITeam {
  teamName: string;
}

export interface ITeamId extends ITeam {
  id: number;
}

export interface IServiceTeams {
  statusCode: number;
  result: ITeamId[] | ITeamId;
}
