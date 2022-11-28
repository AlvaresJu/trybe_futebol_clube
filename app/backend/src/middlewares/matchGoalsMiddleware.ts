import { NextFunction, Request, Response } from 'express';
import HttpException from '../utils/HttpException';

export default function validateGoalsFields(
  req: Request,
  _res: Response,
  next: NextFunction,
): void {
  const { homeTeamGoals, awayTeamGoals } = req.body;
  if (!homeTeamGoals || !awayTeamGoals) {
    throw new HttpException(400, 'All fields must be filled');
  }

  return next();
}
