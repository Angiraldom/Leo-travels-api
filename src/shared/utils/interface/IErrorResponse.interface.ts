export interface IErrorResponse {
  timestamp: string;
  path: string;
  statusCode: number;
  exceptionMessage: string;
  typeException: string;
  customMessage?: string;
  tag?: string;
}
