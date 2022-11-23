import * as express from 'express';
import UserController from '../controllers/UserController';
import UserService from '../services/UserService';
import { IJwtAuth } from '../interfaces/user';
import JwtAuth from '../utils/JwtAuth';
import validateLoginFields from '../middlewares/loginMiddleware';

export default class LoginRoutes {
  public loginRouter: express.IRouter;
  private jwtAuth: IJwtAuth;
  private userService: UserService;
  private userController: UserController;

  constructor() {
    this.loginRouter = express.Router();

    this.jwtAuth = new JwtAuth();
    this.userService = new UserService(this.jwtAuth);
    this.userController = new UserController(this.userService);

    this.loginRouter
      .post('/', validateLoginFields, (req, res) => this.userController.login(req, res));
  }
}
