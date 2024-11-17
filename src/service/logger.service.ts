import winston from "winston";
import MySQLTransport from "../lib/mySqlTransport";
import { Service } from "typedi";
import env from "dotenv";
env.config();

const getEnvVariable = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`${key} not found`);
  }
  return value;
};

@Service()
export default class LoggerService {
  private _logger: winston.Logger;

  constructor() {
    const transports: winston.transport[] = [];

    if (process.env.NODE_ENV == "DEV") {
      transports.push(
        new winston.transports.Console({
          format: winston.format.simple(),
        })
      );
    } else {
      transports.push(
        new MySQLTransport({
          host: getEnvVariable("DB_HOST"),
          user: getEnvVariable("DB_USER"),
          password: getEnvVariable("DB_PASSWORD"),
          database: getEnvVariable("DATABASE"),
          table: getEnvVariable("LOG_TABLE"),
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
