import "reflect-metadata";
import express, { Express, Router } from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import config from "./Shared/config";
import Container from "typedi";
import { PlanRouter } from "./api/index";
import NoteRouter from "./api/note.routes";
import { errorHandler } from "./middleware/errorHandler";

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
  }

  setRoutes() {
    this.app.use("/", this.router);
    Container.get(PlanRouter).SetRouter(this.router);
    Container.get(NoteRouter).SetRouter(this.router);
  }

  setErrorHandler(){
    this.app.use(errorHandler);
  }

  startApp() {
    const port = process.env.APP_PORT || 3001;
    this.app.listen(port, () => {
      console.log(`Project running on ${port}`);
    });
  }
}

new App();
