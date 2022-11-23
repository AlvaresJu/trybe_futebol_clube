import HttpException from '../utils/HttpException';
import Teams from '../database/models/TeamsModel';
import { IServiceTeams } from '../interfaces/teamsInterfaces';

export default class TeamsService {
  static async getAll(): Promise<IServiceTeams> {
    const teams = await Teams.findAll();
    return { statusCode: 200, result: teams };
  }

  static async getById(teamId: number): Promise<IServiceTeams> {
    const team = await Teams.findOne({ where: { id: teamId } });
    if (!team) throw new HttpException(404, 'Team does not exist');
    return { statusCode: 200, result: team };
  }
}
