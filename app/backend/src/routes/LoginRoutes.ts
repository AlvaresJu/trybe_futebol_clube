import * as express from 'express';
import UsersController from '../controllers/UsersController';
import UsersService from '../services/UsersService';
import { IJwtAuth } from '../interfaces/usersInterfaces';
import JwtAuth from '../utils/JwtAuth';
import validateLoginFields from '../middlewares/loginMiddleware';

export default class LoginRoutes {
  public loginRouter: express.IRouter;
  private jwtAuth: IJwtAuth;
  private usersService: UsersService;
  private usersController: UsersController;

  constructor() {
    this.loginRouter = express.Router();

    this.jwtAuth = new JwtAuth();
    this.usersService = new UsersService(this.jwtAuth);
    this.usersController = new UsersController(this.usersService);

    this.loginRouter
      .post('/', validateLoginFields, (req, res) => this.usersController.login(req, res));
    this.loginRouter.get('/validate', (req, res) => this.usersController.validateLogin(req, res));
  }
}
