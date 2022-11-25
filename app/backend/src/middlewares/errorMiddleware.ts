import { Request, Response, NextFunction } from 'express';
import HttpException from '../utils/HttpException';

export default function errorMiddleware(
  err: HttpException,
  _req: Request,
  res: Response,
  _next: NextFunction,
): Response {
  const { statusCode, message } = err;
  console.log(`Error: ${message}`);
  return res.status(statusCode || 500).json({ message });
}
