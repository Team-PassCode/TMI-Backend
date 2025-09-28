import 'reflect-metadata';
import express, { Express, Router } from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import config from './Shared/config';
import { registerControllers } from './util/registerControllers';
import './api/index';
import { errorHandler } from './middleware/errorHandler';
import { wrapAsyncRoutes } from './util/wraAsyncRoutes';

import { swaggerUi, swaggerSpec } from './swagger';
// Import the WebsiteRouter
import WebsiteRouter from './api/websiteRoute';
import { Container } from 'typedi';
import { ReminderScheduler } from './scheduler/ReminderScheduler';

class App {
  private app: Express;
  private router: Router;

  constructor() {
    this.app = express();
    this.router = express.Router();
    this.setMiddleware();
    this.setRoutes();
    this.setErrorHandler();
    this.startApp();
  }

  setMiddleware() {
    this.app.use(cors(config.corsOptions));
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    dotenv.config();
    this.app.use(this.router);

    // Swagger UI setup
    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  }

  setRoutes() {
    this.app.use('/', this.router);
    registerControllers(this.router);

    wrapAsyncRoutes(this.router);

    // Fallback: Mount WebsiteRouter as the last route handler
    const websiteRouter = new WebsiteRouter();
    websiteRouter.SetRouter(this.router);
  }

  setErrorHandler() {
    this.app.use(errorHandler);
  }

  startApp() {
    const port = process.env.APP_PORT || 3001;
    this.app.listen(port, () => {
      console.log(`Project running on ${port}`);
      // Start the reminder scheduler once the app is running.
      const scheduler = Container.get(ReminderScheduler);
      scheduler.start();
    });
  }
}

new App();
