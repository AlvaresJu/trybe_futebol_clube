import { FindOptions } from 'sequelize';
import Match from '../entities/Match';
import TeamsModel from '../database/models/TeamsModel';
import MatchesModel from '../database/models/MatchesModel';
import { IMatch, IServiceMatches } from '../interfaces/matchesInterfaces';
import HttpException from '../utils/HttpException';
import { IJwtAuth } from '../interfaces/usersInterfaces';
import TeamsService from './TeamsService';

export default class MatchesService {
  private includeConfig: FindOptions;

  constructor(private jwtAuth: IJwtAuth) {
    this.includeConfig = { include: [
      { model: TeamsModel, as: 'teamHome', attributes: ['teamName'] },
      { model: TeamsModel, as: 'teamAway', attributes: ['teamName'] },
    ] };
  }

  async getAllWithTeamsName(): Promise<IServiceMatches> {
    const matches = await MatchesModel.findAll(this.includeConfig);
    return { statusCode: 200, result: matches };
  }

  async getAllByInProgressStatus(inProgressStatus: string): Promise<IServiceMatches> {
    if (inProgressStatus !== 'true' && inProgressStatus !== 'false') {
      throw new HttpException(400, '"inProgress" param in the URL need to be "true" or "false"');
    }
    const inProgress = inProgressStatus === 'true';
    const filteredMatches = await MatchesModel.findAll({
      where: { inProgress },
      include: this.includeConfig.include,
    });
    return { statusCode: 200, result: filteredMatches };
  }

  private static async checkMatchTeams(homeTeamId: number, awayTeamId: number): Promise<void> {
    await TeamsService.getById(homeTeamId);
    await TeamsService.getById(awayTeamId);
  }

  async insertInProgressMatch(
    token: string | undefined,
    newMatchData: IMatch,
  ): Promise<IServiceMatches> {
    this.jwtAuth.validateAuth(token);

    const {
      homeTeam, awayTeam, homeTeamGoals, awayTeamGoals, inProgress,
    } = new Match(newMatchData);

    await MatchesService.checkMatchTeams(homeTeam, awayTeam);

    const newMatch = await MatchesModel.create(
      { homeTeam, awayTeam, homeTeamGoals, awayTeamGoals, inProgress },
    );
    return { statusCode: 201, result: newMatch };
  }

  private static async checkMatchId(id: number): Promise<void> {
    const match = await MatchesModel.findOne({ where: { id } });
    if (!match) throw new HttpException(404, 'There is no match with such id!');
  }

  static async updateInProgressStatus(matchId: number): Promise<IServiceMatches> {
    await MatchesService.checkMatchId(matchId);

    await MatchesModel.update(
      { inProgress: false },
      { where: { id: matchId } },
    );
    return { statusCode: 200, result: 'Finished' };
  }
}
