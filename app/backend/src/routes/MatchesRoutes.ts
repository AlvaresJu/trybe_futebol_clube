import * as express from 'express';
import MatchesService from '../services/MatchesService';
import MatchesController from '../controllers/MatchesController';
import { IJwtAuth } from '../interfaces/usersInterfaces';
import JwtAuth from '../utils/JwtAuth';
import validateGoalsFields from '../middlewares/matchGoalsMiddleware';

export default class MatechesRoutes {
  public matchesRouter: express.IRouter;
  private jwtAuth: IJwtAuth;
  private matchesService: MatchesService;
  private matchesController: MatchesController;

  constructor() {
    this.matchesRouter = express.Router();

    this.jwtAuth = new JwtAuth();
    this.matchesService = new MatchesService(this.jwtAuth);
    this.matchesController = new MatchesController(this.matchesService);

    this.matchesRouter
      .get('/', (req, res) => this.matchesController.getAll(req, res));
    this.matchesRouter
      .post('/', (req, res) => this.matchesController.insertInProgressMatch(req, res));
    this.matchesRouter
      .patch('/:id/finish', (req, res) => MatchesController.updateInProgressStatus(req, res));
    this.matchesRouter.patch(
      '/:id',
      validateGoalsFields,
      (req, res) => MatchesController.updateInProgressMatchGoals(req, res),
    );
  }
}
