import Teams from '../database/models/TeamsModel';
import { IServiceTeams } from '../interfaces/teamsInterfaces';

export default class TeamsService {
  static async getAll(): Promise<IServiceTeams> {
    const teams = await Teams.findAll();
    return { statusCode: 200, result: teams };
  }
}
