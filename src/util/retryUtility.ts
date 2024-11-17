export class RetryUtility {
  static async executeWithRetry<T>(
    action: () => Promise<T>,
    maxRetries: number = 3,
    initialDelay: number = 1000,
    maxDelay: number = 30000
  ): Promise<T> {
    maxRetries = Math.min(maxRetries, 10);

    const exceptions: Error[] = [];

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        if (attempt > 0) {
          // Calculate exponential backoff delay
          const delay = Math.min(initialDelay * 2 ** (attempt - 1), maxDelay);
          console.log(`Attempt ${attempt + 1} - Retrying in ${delay} ms...`);
          await this.delay(delay);
        }
        return await action();
      } catch (error: any) {
        exceptions.push(error);

        if (attempt === maxRetries - 1) {
          throw new Error(
            `All retry attempts failed: ${exceptions
              .map((e) => e.message)
              .join(", ")}`
          );
        }
        console.error(`Attempt ${attempt + 1} failed:`, error);
      }
    }

    throw new Error("Unreachable error.");
  }

  private static delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
