import * as cors from 'cors';
import * as express from 'express';
import { checkLogin, login } from './database/controllers/loginController';
import validLogin from './database/middlewares/login';
import { getById, getAll } from './database/controllers/teamController';

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
  }

  public getHttp() {
    this.app.get('/login/validate', checkLogin);
    this.app.get('/teams', getAll);
    this.app.get('/teams/:id', getById);
  }

  public postHttp() {
    this.app.post('/login', validLogin, login);
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
