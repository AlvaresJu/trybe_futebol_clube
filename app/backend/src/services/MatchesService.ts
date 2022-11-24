import { FindOptions } from 'sequelize';
import Teams from '../database/models/TeamsModel';
import Matches from '../database/models/MatchesModel';
import { IServiceMatches } from '../interfaces/matchesInterfaces';
import HttpException from '../utils/HttpException';

export default class MatchesService {
  private includeConfig: FindOptions;

  constructor() {
    this.includeConfig = { include: [
      { model: Teams, as: 'teamHome', attributes: ['teamName'] },
      { model: Teams, as: 'teamAway', attributes: ['teamName'] },
    ] };
  }

  async getAllWithTeamsName(): Promise<IServiceMatches> {
    const matches = await Matches.findAll(this.includeConfig);
    return { statusCode: 200, result: matches };
  }

  async getAllByInProgressStatus(inProgressStatus: string): Promise<IServiceMatches> {
    if (inProgressStatus !== 'true' && inProgressStatus !== 'false') {
      throw new HttpException(400, '"inProgress" param in the URL need to be "true" or "false"');
    }
    const inProgress = inProgressStatus === 'true';
    const filteredMatches = await Matches.findAll({
      where: { inProgress },
      include: this.includeConfig.include,
    });
    return { statusCode: 200, result: filteredMatches };
  }
}
