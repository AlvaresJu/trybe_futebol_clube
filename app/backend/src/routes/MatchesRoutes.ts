import * as express from 'express';
import MatchesService from '../services/MatchesService';
import MatchesController from '../controllers/MatchesController';

export default class MatechesRoutes {
  public matchesRouter: express.IRouter;
  private matchesService: MatchesService;
  private matchesController: MatchesController;

  constructor() {
    this.matchesRouter = express.Router();

    this.matchesService = new MatchesService();
    this.matchesController = new MatchesController(this.matchesService);

    this.matchesRouter.get('/', (req, res) => this.matchesController.getAll(req, res));
  }
}
