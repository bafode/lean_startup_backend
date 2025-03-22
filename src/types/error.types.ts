export interface IErrorDetail {
  field?: string; // The specific field that caused the error (optional)
  message: string; // The error message
}

export interface IApiError {
  statusCode: number; // HTTP status code
  message: string; // General error message
  details?: IErrorDetail[]; // Optional array of field-specific error details
}
