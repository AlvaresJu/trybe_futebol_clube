import HttpException from '../utils/HttpException';
import TeamsModel from '../database/models/TeamsModel';
import { IServiceTeams } from '../interfaces/teamsInterfaces';

export default class TeamsService {
  static async getAll(): Promise<IServiceTeams> {
    const teams = await TeamsModel.findAll();
    return { statusCode: 200, result: teams };
  }

  static async getById(teamId: number): Promise<IServiceTeams> {
    const team = await TeamsModel.findOne({ where: { id: teamId } });
    if (!team) throw new HttpException(404, 'There is no team with such id!');
    return { statusCode: 200, result: team };
  }
}
