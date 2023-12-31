import * as cors from 'cors';
import * as express from 'express';
import { checkLogin, login } from './database/controllers/loginController';
import leaderboardController from './database/controllers/leaderBoardController';
import matchController from './database/controllers/matchController';
import teamController from './database/controllers/teamController';
import validLogin from './database/middlewares/login';
import validMatch from './database/middlewares/match';

class App {
  public app: express.Express;

  constructor() {
    this.app = express();

    this.config();
    this.routes();

    // Não remover essa rota
    this.app.get('/', (req, res) => res.json({ ok: true }));
  }

  public routes() {
    this.getHttp();
    this.postHttp();
    this.patchHttp();
  }

  public getHttp() {
    this.app.get('/leaderboard', leaderboardController.getLeaderBoard);
    this.app.get('/leaderboard/home', leaderboardController.getLeaderBoardHome);
    this.app.get('/login/validate', checkLogin);
    this.app.get('/matches/?', matchController.getInProgress, matchController.getAll);
    this.app.get('/teams', teamController.getAll);
    this.app.get('/teams/:id', teamController.getById);
  }

  public postHttp() {
    this.app.post('/login', validLogin, login);
    this.app.post('/matches', validMatch, matchController.createMatchInprogress);
  }

  public patchHttp() {
    this.app.patch('/matches/:id', matchController.updateScore);
    this.app.patch('/matches/:id/finish', matchController.updateProgress);
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
    this.app.use(cors());
  }

  public start(PORT: string | number):void {
    this.app.listen(PORT, () => console.log(`Running on port ${PORT}`));
  }
}

export { App };

// Essa segunda exportação é estratégica, e a execução dos testes de cobertura depende dela
export const { app } = new App();
