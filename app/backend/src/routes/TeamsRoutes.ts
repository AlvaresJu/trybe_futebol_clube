import * as express from 'express';
import TeamsController from '../controllers/TeamsController';

export default class TeamsRoutes {
  public teamsRouter: express.IRouter;

  constructor() {
    this.teamsRouter = express.Router();

    this.teamsRouter.get('/', (req, res) => TeamsController.getAll(req, res));
    this.teamsRouter.get('/:id', (req, res) => TeamsController.getById(req, res));
  }
}
