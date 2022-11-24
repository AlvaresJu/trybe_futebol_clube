import Teams from '../database/models/TeamsModel';
import Matches from '../database/models/MatchesModel';
import { IServiceMatches } from '../interfaces/matchesInterfaces';

export default class MatchesService {
  static async getAllWithTeamsName(): Promise<IServiceMatches> {
    const matches = await Matches.findAll({ include: [
      { model: Teams, as: 'teamHome', attributes: ['teamName'] },
      { model: Teams, as: 'teamAway', attributes: ['teamName'] },
    ] });
    return { statusCode: 200, result: matches };
  }
}
