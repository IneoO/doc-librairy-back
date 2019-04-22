import * as process from 'process';
import express from 'express';
import * as bodyParser from 'body-parser';
// import * as cookieParser from 'cookie-parser';
import * as dotenv from 'dotenv';
import bluebird from 'bluebird';
import mongoose from 'mongoose';
import { MONGODB_URI } from './utils/secrets';
import loggerMiddleware from './middleware/logger.middleware';
import errorMiddleware from './middleware/error.middleware';

class App {
  public app: express.Application;
  public port: number;
  public env: string;

  constructor(controllers) {
    dotenv.config({ path: '.env' });
    this.app = express();
    console.log(MONGODB_URI);
    this.port = Number(process.env.PORT) || 3000;

    this.connectToTheDatabase();
    this.initializeMiddlewares();
    this.initializeControllers(controllers);
    this.initializeErrorHandling();
  }

  private connectToTheDatabase() {
    const mongoUrl = MONGODB_URI;
    (<any>mongoose).Promise = bluebird;
    mongoose.connect(mongoUrl, { useNewUrlParser: true }).catch(err => {
      console.info(`MongoDB connection error. Please make sure MongoDB is running. ${err}`);
      process.exit();
    });
  }

  private initializeMiddlewares() {
    this.app.use(bodyParser.json());
    // this.app.use(cookieParser());
    this.app.use(loggerMiddleware);
  }

  private initializeControllers(controllers) {
    controllers.forEach(controller => {
      this.app.use('/', controller.router);
    });
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }

  public listen() {
    this.app.listen(this.port, () => {
      console.log(
        `App is running at http://localhost:${this.port}`,
      );
    });
  }
}

export default App;
