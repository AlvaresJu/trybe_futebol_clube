export interface IUser {
  username: string;
  role: string;
  email: string;
  password: string;
}

export interface IUserId extends IUser {
  id: number;
}

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
}
