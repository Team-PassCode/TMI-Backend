import winston from "winston";
import MySQLTransport from "../lib/mySqlTransport";
import { Service } from "typedi";
import env from "dotenv";
env.config();

@Service()
export default class LoggerService {
  private _logger: winston.Logger;

  constructor() {
    const transports: winston.transport[] = [];
    console.log(process.env.NODE_ENV);

    if (process.env.NODE_ENV == "DEV") {
      transports.push(
        new winston.transports.Console({
          format: winston.format.simple(),
        })
      );
    } else {
      transports.push(
        new MySQLTransport({
          host: process.env.DB_HOST || "",
          user: process.env.DB_USER || "",
          password: process.env.DB_PASSWORD || "",
          database: process.env.DATABASE || "",
          table: process.env.LOG_TABLE || "",
        })
      );
    }

    this._logger = winston.createLogger({
      format: winston.format.json(),
      transports,
    });
  }

  public info(message: string, meta: any): void {
    this._logger.info(message, meta);
  }

  public error(message: string, meta: any): void {
    this._logger.error(message, meta);
  }
}
