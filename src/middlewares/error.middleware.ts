import httpStatus from 'http-status';
import { config, logger } from '../config';
import { ApiError } from '../utils';
import { NextFunction, Request, Response } from 'express';
import { ENodeEnv } from '../types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const errorConverter = (err: any, req: Request, res: Response, next: NextFunction) => {
  let error = err;
  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
    const message = err.message || httpStatus[statusCode as keyof typeof httpStatus];
    error = new ApiError(statusCode, message, undefined, false);
  }
  next(error);
};

// eslint-disable-next-line no-unused-vars
const errorHandler = (err: ApiError, req: Request, res: Response, next: NextFunction) => {
  // In production, hide error details for non-operational errors
  if (config.env === ENodeEnv.PROD && !err.isOperational) {
    err = new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      httpStatus[httpStatus.INTERNAL_SERVER_ERROR] as string
    );
  }

  // Log the error
  res.locals.errorMessage = err.message;
  //logger.error(err);

  // Format the error for client consumption
  const response = {
    code: err.statusCode,
    message: err.message.split('\n')[0], // Ensure the message contains only the first line
    details: err.details || [], // Include details if available
    ...(config.env === ENodeEnv.DEV && { stack: err.stack }), // Include stack trace only in development
  };

  // Send the response
  res.status(err.statusCode).send(response);
};

export { errorConverter, errorHandler };
