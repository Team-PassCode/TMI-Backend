import { Service } from "typedi";
import DbConnection from "./dbConnection";
import { DBqueries } from "../Shared/dBQueries";
import { RetryUtility } from "../util/retryUtility";

@Service()
export default class ErrorLogDAL extends DbConnection {
  constructor() {
    super();
  }

  async logError(
    message: string,
    stackTrace: string,
    additionalData: Record<string, any>,
    maxRetries: number = 3, //using default
    initialDelay: number = 1000
  ) {
    await RetryUtility.executeWithRetry(
      () =>
        this.InsertOrUpdateDB(
          [DBqueries.LogError],
          [[message, stackTrace, JSON.stringify(additionalData), new Date()]]
        ),
      maxRetries,
      initialDelay
    );
  }
}
