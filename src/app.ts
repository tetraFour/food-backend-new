import express, { Router } from 'express';
import mongoose from 'mongoose';
import server, { Server } from 'http';
import { isDev } from './utils';

class App {
  private readonly app: express.Application;
  private readonly port: number;
  private readonly server: Server;
  private router: Router;

  constructor(appInit: {
    port: number;
    middlewares: any;
    setters: any;
    controllers: any;
  }) {
    this.router = Router();
    this.app = express();
    this.port = appInit.port;
    this.server = server.createServer(this.app);

    this.middlewares(appInit.middlewares);
    this.setters(appInit.setters);
    this.routes(appInit.controllers);
    this.assets();
    this.databaseConnection();

    console.log('process.env.NODE_ENV:', process.env.NODE_ENV);
  }

  private middlewares(middlewares: {
    forEach: (mw: (middleWare: any) => void) => void;
  }) {
    middlewares.forEach((middleWare) => {
      this.app.use(middleWare);
    });
  }

  private setters(setters: { forEach: (st: (setter: any) => void) => void }) {
    setters.forEach((setter) => {
      this.app.set(setter.name, setter.description);
    });
  }

  private routes(routes: { forEach: (router: (router: any) => void) => void }) {
    routes.forEach((router) => {
      this.app.use('/', router.router);
    });
  }

  private async databaseConnection() {
    try {
      await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
      });

      console.log('MONGO_DB: SUCCESS');
    } catch (e) {
      console.error(e);
    }
  }

  private assets() {
    this.app.use(express.static('public'));
  }

  public listen(): void {
    this.server.listen(this.port, () => {
      console.log(`NODEJS: App listening on the http://localhost:${this.port}`);
    });
  }
}

export default App;
