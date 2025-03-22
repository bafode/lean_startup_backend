import { IErrorDetail } from '../types/error.types';

class ApiError extends Error {
  statusCode: number;
  isOperational: boolean;
  details?: IErrorDetail[];

  /**
   * Creates an instance of ApiError.
   * @param {number} statusCode - HTTP status code of the error.
   * @param {string} message - Error message.
   * @param {IErrorDetail[]} [details] - Optional array of error details (e.g., field-specific errors).
   * @param {boolean} [isOperational=true] - Whether the error is operational (user-facing).
   */
  constructor(
    statusCode: number,
    message: string,
    details?: IErrorDetail[],
    isOperational = true
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.details = details;

    // Capture the stack trace for debugging purposes
    Error.captureStackTrace(this, this.constructor);
  }
}

export default ApiError;
