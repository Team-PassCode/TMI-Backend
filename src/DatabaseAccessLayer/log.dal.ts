import { Service } from "typedi";
import DbConnection from "./dbConnection";
import { DBqueries } from "../Shared/dBQueries";

@Service()
export default class ErrorLogDAL extends DbConnection {
  constructor() {
    super();
  }

  async logError(
    message: string,
    stackTrace: string,
    additionalData: Record<string, unknown>
  ) {
    try {
      await this.InsertOrUpdateDB(
        [DBqueries.LogError],
        [[
          message,
          stackTrace,
          JSON.stringify(additionalData),
          new Date()
        ]]
      );
    } catch (error) {
      console.error("Failed to log error:", error);
    }
  }
}
