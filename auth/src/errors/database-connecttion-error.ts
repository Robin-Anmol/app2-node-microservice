import { CustomError } from "./custom-error";

export class DatabaseConnectionError extends CustomError {
  reasons = "Error connecting to database";
  statusCode = 500;
  constructor() {
    super("Database connection error");
    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }

  serializeErrors() {
    return [
      {
        message: this.reasons,
      },
    ];
  }
}
