export interface IServiceLogin {
  statusCode: number;
  result: string;
}

export interface IAuthData {
  id: number;
  username: string;
  iat?: number;
  exp?: number;
}

export interface IJwtAuth {
  createToken(data: IAuthData): string;
  validateToken(token: string): number;
  validateAuth(token: string | undefined): number;
}
