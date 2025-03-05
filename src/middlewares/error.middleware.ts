import httpStatus from 'http-status';
import { config, logger } from '../config';
import { ApiError, formatErrorForClient } from '../utils';
import { NextFunction, Request, Response } from 'express';
import { ENodeEnv } from '../types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const errorConverter = (err: any, req: Request, res: Response, next: NextFunction) => {
  let error = err;
  if (!(error instanceof ApiError)) {
    const statusCode =
      error.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
    const message = error.message ;
    error = new ApiError(statusCode, message, false, err.stack);
  }
  next(error);
};

// eslint-disable-next-line no-unused-vars
const errorHandler = (err: ApiError, req: Request, res: Response) => {
  // In production, hide error details for non-operational errors
  if (config.env === ENodeEnv.PROD && !err.isOperational) {
    err = new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      httpStatus[httpStatus.INTERNAL_SERVER_ERROR].toString(),
      false
    );
  }

  // Log the error
  res.locals.errorMessage = err.message;
  logger.error(err);

  // Format the error for client consumption
  const formattedError = formatErrorForClient(err);
  
  // Add stack trace in development mode
  const response = {
    ...formattedError,
    ...(config.env === ENodeEnv.DEV && { stack: err.stack }),
  };

  // Send the response
  res.status(formattedError.code).send(response);
};

export { errorConverter, errorHandler };
