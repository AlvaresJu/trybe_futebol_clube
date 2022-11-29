import * as express from 'express';
import 'express-async-errors';
import errorMiddleware from './middlewares/errorMiddleware';
import LeaderboardRoutes from './routes/LeaderboardRoutes';
import LoginRoutes from './routes/LoginRoutes';
import MatechesRoutes from './routes/MatchesRoutes';
import TeamsRoutes from './routes/TeamsRoutes';

class App {
  public app: express.Express;
  private loginRoutes: LoginRoutes;
  private teamsRoutes: TeamsRoutes;
  private matchesRoutes: MatechesRoutes;
  private leaderboardRoutes: LeaderboardRoutes;

  constructor() {
    this.app = express();

    this.config();

    this.loginRoutes = new LoginRoutes();
    this.teamsRoutes = new TeamsRoutes();
    this.matchesRoutes = new MatechesRoutes();
    this.leaderboardRoutes = new LeaderboardRoutes();

    // Não remover essa rota
    this.app.get('/', (_req, res) => res.json({ ok: true }));

    this.app.use('/login', this.loginRoutes.loginRouter);
    this.app.use('/teams', this.teamsRoutes.teamsRouter);
    this.app.use('/matches', this.matchesRoutes.matchesRouter);
    this.app.use('/leaderboard', this.leaderboardRoutes.leaderboardRouter);

    this.app.use(errorMiddleware);
  }

  private config():void {
    const accessControl: express.RequestHandler = (_req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS,PUT,PATCH');
      res.header('Access-Control-Allow-Headers', '*');
      next();
    };

    this.app.use(express.json());
    this.app.use(accessControl);
  }

  public start(PORT: string | number):void {
    this.app.listen(PORT, () => console.log(`Running on port ${PORT}`));
  }
}

export default App;
