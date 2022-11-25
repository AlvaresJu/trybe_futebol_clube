import * as Joi from 'joi';
import HttpException from '../utils/HttpException';
import { IMatch } from '../interfaces/matchesInterfaces';

export default class Match implements IMatch {
  private _homeTeam: number;
  private _awayTeam: number;
  private _homeTeamGoals: number;
  private _awayTeamGoals: number;
  private _inProgress: boolean;
  private matchSchema: Joi.ObjectSchema;

  constructor(matchParams: IMatch) {
    this.matchSchema = Joi.object({
      homeTeam: Joi.number().integer().min(1).required(),
      awayTeam: Joi.number().integer().min(1).required(),
      homeTeamGoals: Joi.number().integer().min(0).required(),
      awayTeamGoals: Joi.number().integer().min(0).required(),
    });

    this.validateMatchData(matchParams);
    Match.checkIfSameTeam(matchParams.homeTeam, matchParams.awayTeam);

    this._homeTeam = matchParams.homeTeam;
    this._awayTeam = matchParams.awayTeam;
    this._homeTeamGoals = matchParams.homeTeamGoals;
    this._awayTeamGoals = matchParams.awayTeamGoals;
    this._inProgress = true;
  }

  get homeTeam() { return this._homeTeam; }
  get awayTeam() { return this._awayTeam; }
  get homeTeamGoals() { return this._homeTeamGoals; }
  get awayTeamGoals() { return this._awayTeamGoals; }
  get inProgress() { return this._inProgress; }

  private validateMatchData(newMatch: IMatch): void {
    const { error } = this.matchSchema.validate(newMatch, { convert: false });
    if (error) throw new HttpException(400, error.message);
  }

  private static checkIfSameTeam(homeTeamId: number, awayTeamId: number): void {
    if (homeTeamId === awayTeamId) {
      throw new HttpException(422, 'It is not possible to create a match with two equal teams');
    }
  }
}
