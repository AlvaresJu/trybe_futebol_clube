import * as express from 'express';
import MatchesController from '../controllers/MatchesController';

export default class MatechesRoutes {
  public matchesRouter: express.IRouter;

  constructor() {
    this.matchesRouter = express.Router();

    this.matchesRouter.get('/', (req, res) => MatchesController.getAllWithTeamsName(req, res));
  }
}
