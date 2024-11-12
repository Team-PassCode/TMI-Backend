import { Service } from "typedi";
import DbConnection from "./dbConnection";
import { DBqueries } from "../Shared/dBQueries";

// My CustomAggregateError class : using custom error class to avoid referencing the AggregateError by just using a 
// regular error with multiple errors stored in it.
class CustomAggregateError extends Error {
  errors: Error[];

  constructor(errors: Error[], message: string = "Multiple errors occurred") {
    super(message);
    this.errors = errors;
    this.name = "AggregateError";
  }
}

@Service()
export default class ErrorLogDAL extends DbConnection {
  constructor() {
    super();
  }
  // The logError method calls executeWithRetry, which attempts to insert the error log into the database. 
  // If the database operation fails, it retries up to a specified number of times (maxRetries), with an exponential backoff delay between attempts.

  async logError(
    message: string,
    stackTrace: string,
    additionalData: Record<string, any>,
    maxRetries: number = 3, //using default 
    initialDelay: number = 1000
  ) {
    await this.executeWithRetry(
      () =>
        this.InsertOrUpdateDB(
          [DBqueries.LogError],
          [[message, stackTrace, JSON.stringify(additionalData), new Date()]]
        ),
      maxRetries,
      initialDelay
    );
  }

  private async executeWithRetry<T>(
    action: () => Promise<T>,
    maxRetries: number = 3,
    initialDelay: number = 1000,
    maxDelay: number = 30000
  ): Promise<T> {
    maxRetries = Math.min(maxRetries, 10);

    const exceptions: Error[] = []; // Collects all retry errors 

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        if (attempt > 0) {
          // Calculate exponential backoff delay logic 
          const delay = Math.min(initialDelay * 2 ** (attempt - 1), maxDelay); //formula
          console.log(`Attempt ${attempt + 1} - Retrying in ${delay} ms...`);
          await this.delay(delay);
        }
        return await action();
      } catch (error:any) {
        exceptions.push(error); // Store the error

        if (attempt === maxRetries - 1) {
          throw new CustomAggregateError(exceptions, "All retry attempts failed.");  // Throw an aggregated error after the final attempt fails
        }
        console.error(`Attempt ${attempt + 1} failed:`, error);
      }
    }
    throw new CustomAggregateError(exceptions, "Unreachable error.");
  }
  // The delay method introduces a delay before retrying, and the delay time increases exponentially with each failed attempt.
  private delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
