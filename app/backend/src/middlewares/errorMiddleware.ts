import { Request, Response, NextFunction } from 'express';
import HttpException from '../utils/HttpException';

function errorMiddleware(err: HttpException, _req: Request, res: Response, _next: NextFunction) {
  const { statusCode, message } = err;
  console.log(`Error: ${message}`);
  return res.status(statusCode || 500).json({ message });
}

export default errorMiddleware;
