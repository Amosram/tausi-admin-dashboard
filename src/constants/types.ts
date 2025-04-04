export type Theme = "dark" | "light" | "system"

enum StatusCode {
    SUCCESS = 'SUCCESS',
    WARN = 'WARN',
    FAILURE = 'FAILURE',
    RETRY = 'RETRY',
    UNAUTHORIZED = 'UNAUTHORIZED',
    INVALID_ACCESS_TOKEN = 'INVALID_ACCESS_TOKEN',
    SERVER_ERROR = 'SERVER_ERROR'
  }

export type GenericResponse<T> = {
  data: T;
  message: string;
  statusCode: StatusCode;
  code: number;
}
