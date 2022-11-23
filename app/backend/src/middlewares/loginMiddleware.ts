import { NextFunction, Request, Response } from 'express';
import HttpException from '../utils/HttpException';

export default function validateLoginFields(req: Request, _res: Response, next: NextFunction) {
  const { email, password } = req.body;
  if (!email || !password) throw new HttpException(400, 'All fields must be filled');

  return next();
}
