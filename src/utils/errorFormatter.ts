import { ApiError } from './index';
import httpStatus from 'http-status';

interface ErrorResponse {
  success: boolean;
  error: boolean;
  code: number;
  message: string;
  details?: Record<string, any>;
  fieldErrors?: Record<string, string[]>;
}

// Type for any HTTP status code
type HttpStatusCode = number;

/**
 * Format error for frontend consumption, especially for Flutter clients
 * @param error - The error object to format
 * @returns A standardized error response object
 */
export const formatErrorForClient = (error: Error | ApiError): ErrorResponse => {
  // Default values
  let statusCode: HttpStatusCode = httpStatus.INTERNAL_SERVER_ERROR;
  let message = 'Une erreur est survenue';
  let details: Record<string, any> = {};
  let fieldErrors: Record<string, string[]> | undefined = undefined;

  // Handle ApiError instances
  if (error instanceof ApiError) {
    statusCode = error.statusCode;
    message = error.message;
  }

  // Handle validation errors (assuming mongoose validation or express-validator)
  if (error.name === 'ValidationError') {
    statusCode = httpStatus.BAD_REQUEST;
    message = 'Erreur de validation';
    
    // Format mongoose validation errors
    if ('errors' in error && typeof error.errors === 'object') {
      fieldErrors = {};
      Object.keys(error.errors).forEach((field) => {
        if (fieldErrors) {
          const errorObj = (error.errors as Record<string, any>)[field];
          fieldErrors[field] = [errorObj?.message || 'Champ invalide'];
        }
      });
    }
    
    // Format express-validator errors
    if (Array.isArray((error as any).errors)) {
      fieldErrors = {};
      (error as any).errors.forEach((err: any) => {
        const field = err.param || 'unknown';
        if (!fieldErrors) fieldErrors = {};
        if (!fieldErrors[field]) {
          fieldErrors[field] = [];
        }
        fieldErrors[field].push(err.msg || 'Champ invalide');
      });
    }
  }

  // Handle JWT errors
  if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
    statusCode = httpStatus.UNAUTHORIZED;
    message = 'Session expirée, veuillez vous reconnecter';
  }

  // Handle MongoDB duplicate key errors
  if ((error as any).code === 11000) {
    statusCode = httpStatus.CONFLICT;
    message = 'Cette ressource existe déjà';
    
    // Extract the duplicate field
    const field = Object.keys((error as any).keyPattern || {})[0];
    if (field) {
      details = { 
        duplicateField: field,
        duplicateValue: (error as any).keyValue?.[field]
      };
      
      // More user-friendly message for common fields
      if (field === 'email') {
        message = 'Cet email est déjà utilisé';
      } else if (field === 'username') {
        message = 'Ce nom d\'utilisateur est déjà pris';
      }
    }
  }

  // Return standardized error response
  return {
    success: false,
    error: true,
    code: statusCode,
    message,
    ...(Object.keys(details).length > 0 && { details }),
    ...(fieldErrors && { fieldErrors }),
  };
};

export default formatErrorForClient;
